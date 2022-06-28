// TODO: Use error library and move warning logging to over there.
const logger = require('../logger/index');
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
class AuthenticationError extends Error {}
class JWTError extends Error {}
const db = require('../models/index');
const { sequelize } = require('../models/index');
class Authenticator {
  constructor(pool) {
    this.pool = pool;
  }

  static createToken(payload) {
    var options = {};
    return new Promise((resolve, reject) => {
      jwt.sign(payload, config.secret, options, (err, token) => {
        if (err) reject(new JWTError(err));
        resolve(token);
      });
    });
  }

  static async encryptPayload(payload) {
    return await bcrypt.hash(payload, config.saltRounds);
  }
  async registerUser(username, password, first_name, middle_name, last_name, role, administratorUsername) {
    var user = {
      username: username,
      password: await Authenticator.encryptPayload(password),
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
    }
    if(role != "administrator")   {
      if(!administratorUsername) throw new AuthenticationError("Administrator Username must be provided.")
      const administrator = await db["administrator"].findOne({
        where: {username: administratorUsername}
      });
      if(!administrator) {
        throw new AuthenticationError("Administrator Not Found.")
      }
      user.administrator_id = administrator.administrator_id;
    }
    try {
      const registeredUser = await db[role].create(user);
      logger.log(
        "info",
        `${role} ${username} registered successfully`
      );
      return registeredUser;
    } catch(err) {
      logger.warn(`${role} ${username} not registered successfully`);
      if (err instanceof Sequelize.UniqueConstraintError){
        const err = new AuthenticationError(`${role} already exists.`);
        err.code = 403;
        throw err;
      }
      err.code = 500;
      throw new AuthenticationError(err);
    }
  }

  async registerAdministrator(username, password, first_name, middle_name, last_name) {
    const administrator = await this.registerUser(username, password, first_name, middle_name, last_name, "administrator", null);
    return administrator;
  }



  async registerOther(username, password, first_name, middle_name, last_name, role, administratorUsername) {
    const other = await this.registerUser(username, password, first_name, middle_name, last_name, role, administratorUsername);
    return other;
  }

  async unregisterExaminee(administrator, username) {
    try {
      let examinees = await administrator.getExaminees({
        where: {
          username: username
        }
      });
      await administrator.removeExaminee(examinees);
      if(examinees.length == 0) {
        throw new AuthenticationError("Examinee not Found")
      }
      examinees[0].destroy();
    logger.log("info", `Examinee ${username} unregistered successfully`);
    } catch(err) {
      logger.warn(
        `Examinee ${username} not unregistered successfully, error: ${err}`
      )
      throw new AuthenticationError(err);
    }
  }

  async unregisterProctor(administrator, username) {
    try {
      let proctor = await administrator.getProctors({
        where: {
          username: username
        }
      });
      await administrator.removeProctor(proctor);
      if(proctor.length == 0) {
        throw new AuthenticationError("Proctor not Found")
      }
      proctor[0].destroy();
      logger.log("info", `Proctor ${username} unregistered successfully`);
    } catch(err) {
      logger.warn(
        `Proctor ${username} not unregistered. error: ${err}`
      )
      throw new AuthenticationError(err);
    }
  }
  
  async unregisterAdministrator(administrator) {
    try {
    await administrator.destroy();
    logger.log("info", `Administrator ${administrator.username} unregistered successfully`);
  } catch(err) {
    logger.warn(
      `Administrator ${administrator.username} not unregistered, error: ${err}`
    )
    throw new AuthenticationError(err);
  }
}

  async verifyPassword(plainTextPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainTextPassword, hashedPassword, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  async loginUser(username, password, role, administratorUsername) {
    if(!['administrator', 'examinee', 'proctor'].includes(role))
      throw new AuthenticationError("Unknown Role Provided!");

    let user = await db[role].findOne({
      where: { username: username }
    });
    if (!user) {
      logger.warn(`${role} ${username} not found, cannot login`);
      throw new AuthenticationError(`${role} not found`);
    }
    if (role != "administrator") { 
      if(!administratorUsername)  
        throw new AuthenticationError("Administrator Username is required");
      let administrator = db['administrator'].findOne({
        where: { username: administratorUsername }
      });
      if (! user.administrator_id == administrator.id)
        throw new AuthenticationError(`Invalid Administrator provided for ${username}`);
    }
    let res = await this.verifyPassword(password, user.password);
    if (!res) {
      logger.warn(`${role} ${username} not logged in successfully, invalid password`);
      throw new AuthenticationError("Invalid password");
    }
    logger.log(
      "info",
      `${role} ${username} logged in successfully`
      );
    let payload = {
      sub: user.id,
      role: role
    }
    return Authenticator.createToken(payload);
  }

  async loginAdministrator(username, password) {
    return await this.loginUser(username, password, "administrator", null);
  }
  async loginOther(username, password, role, administratorUsername) {
    return await this.loginUser(username, password, role, administratorUsername)
  }
  
  static defaultAuthenticator = new Authenticator (sequelize);
}
module.exports = Authenticator;
