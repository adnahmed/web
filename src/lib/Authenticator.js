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

  async registerAdministrator(username, password, first_name, last_name) {
    try {
      password = await Authenticator.encryptPayload(password);
      await db['administrator'].create({username: username, password: password, first_name: first_name, last_name: last_name});  
      logger.log(
        "info",
        `Administrator ${username} registered successfully`
      );
    } catch(err) {
      logger.warn(`Administrator ${username} not registered successfully`);
      if (err instanceof Sequelize.UniqueConstraintError)
        throw new AuthenticationError("Administrator already exists.");
      throw new AuthenticationError(err);
    }
  }



  async registerProctor(administrator, username, password, first_name, last_name) {
    try {
      password = await Authenticator.encryptPayload(password);
      await administrator.createProctor({
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name
      });
      logger.log(
        "info",
        `Proctor ${username} registered successfully`
      );
    }
    catch(err) {
      logger.warn(`Proctor ${username} not registered successfully, error: ${err}`);
      if (err instanceof Sequelize.UniqueConstraintError) 
        throw new AuthenticationError("Proctor already registered.")
      throw new AuthenticationError(err);
    }
  }

  async registerExaminee(administrator, username, password, first_name, last_name) {
    try{
      password = await Authenticator.encryptPayload(password);
      await administrator.createExaminee({
        username: username,
        password: password,
        first_name: first_name,
        last_name: last_name
      });

      logger.log(
        "info",
        `Examinee ${username} registered successfully`
      );
    }
    catch(err) {
      logger.warn(
        `Examinee ${username} not registered successfully, error: ${err}`
      )
      if(err instanceof Sequelize.UniqueConstraintError)
        throw new AuthenticationError("Examinee already registered.");
      throw new AuthenticationError(err);
    }
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

  async loginUser(username, password, role) {
    if(!['administrator', 'examinee', 'proctor'].includes(role))
      throw new AuthenticationError("Unknown Role Provided!");

    let user = await db[role].findOne({
      where: { username: username }
    });

    if (!user) {
      logger.warn(`${role} ${username} not found, cannot login`);
      throw new AuthenticationError(`${role} not found`);
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

  
  static defaultAuthenticator = new Authenticator (sequelize);
}
module.exports = Authenticator;
