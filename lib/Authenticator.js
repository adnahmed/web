const logger = require('../logger/index');
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
class AuthenticationError extends Error {}
class JWTError extends Error {}
const db = require('../models/index');
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
    await administrator.removeExaminee({
      // TODO: finish remove queries with join
    });
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

      await administrator.removeProctor({
        // TODO: finish remove query with joins
      })
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

  async loginProctor(username, password) {
      let proctor = await db['proctor'].findOne({
        where: { username: username }
      });
      if (!proctor) {
        logger.warn(`Proctor ${username} not found, cannot login`);
        throw new AuthenticationError("Proctor not found");
      }
      let res = await this.verifyPassword(password, proctor.password);
      if (!res) {
        logger.warn(`Proctor ${username} not logged in successfully`);
        throw new AuthenticationError("Invalid password");
      }
      logger.log(
        "info",
        `Proctor ${username} logged in successfully`
      );
     let payload = {
      sub: proctor.id,
    }
      return Authenticator.createToken(payload);
  }

  async loginExaminee(username, password) {
    let examinee = await db['examinee'].findOne({
      where: { username: username }
    });
    if (!examinee) {
      logger.warn(`Examinee ${username} not found, cannot login`);
      throw new AuthenticationError("Examinee not found");
    }
    let res = await this.verifyPassword(password, examinee.password);
    if (!res) {
      logger.warn(`Examinee ${username} not logged in successfully`);
      throw new AuthenticationError("Invalid password");
    }
    logger.log(
      "info",
      `Examinee ${username} logged in successfully`
    );

    let payload = {
      sub: examinee.id,
    }
    return Authenticator.createToken(payload);
  }

  async loginAdministrator(username, password) {
    let administrator = await db['administrator'].findOne({
      where: { username: username }
    });
    if (!administrator) {
      logger.warn(`Administrator ${username} not found, cannot login`);
      throw new AuthenticationError("Administrator not found");
    }
    let res = await this.verifyPassword(password, administrator.password);
    if (!res) {
      logger.warn(`Administrator ${username} not logged in successfully`);
      throw new AuthenticationError("Invalid password");
    }
    logger.log(
      "info",
      `Administrator ${username} logged in successfully`
    );
    let payload = {
      sub: administrator.id,
    }
    return Authenticator.createToken(payload);
  }

  static defaultAuthenticator = new Authenticator (require("../db/index"));
}
module.exports = Authenticator;
