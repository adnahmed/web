
const Administrator = require('../models/administrator');
const Examinee = require('../models/examinee');
const Proctor = require('../models/proctor');
const logger = require('../logger/index');
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
class AuthenticationError extends Error {}
class JWTError extends Error {}

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
      await Administrator.create({username: username, password: password, first_name: first_name, last_name: last_name});  
      logger.log(
        "info",
        `Administrator ${username} registered successfully`
      );
    } catch(err) {
      logger.warn(`Administrator ${username} not registered successfully`);
      throw new AuthenticationError(err);
    }
  }



  async registerProctor(adminId, username, password, first_name, last_name) {
    try {
      let administrator = await Administrator.findOne({
        where: {
          id: adminId
        }
      });
      if (!administrator) {
        logger.warn(`Administrator ${adminId} not found, cannot register proctor`);
        throw new AuthenticationError("Administrator not found");
      }
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
      logger.warn(`Proctor ${username} not registered successfully`);
      throw new AuthenticationError(err);
    }
  }

  async registerExaminee(adminId, username, password, first_name, last_name) {
    try{
      let administrator = await Administrator.findOne({
        where: { id: adminId }
      });
      if (!administrator) {
        throw new AuthenticationError("Administrator not found");
      }
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
    } catch(err) {
      logger.warn(
        `Examinee ${username} not registered successfully`
      )
      throw AuthenticationError(err);
    }
  }

  async unregisterExaminee(adminId, id) {
    try {
      const administrator = await Administrator.findOne({
      where: { id: adminId }
    });
    if (!administrator) {
      throw new AuthenticationError("Administrator not found");
    }
    await administrator.destroyExaminee({
      id: id
    });
    logger.log("info", `Examinee ${examinee.username} unregistered successfully`);
    } catch(err) {
      logger.warn(
        `Examinee ${examinee.username} not unregistered successfully`
      )
      throw AuthenticationError(err);
    }
  }
  async unregisterProctor(adminId, id) {
    try {
      const administrator = await Administrator.findOne({
        where: { id: adminId }
      });
      if (!administrator) {
        throw new AuthenticationError("Administrator not found");
      }
      await administrator.destroyProctor({
        id: id
      });
      logger.log("info", `Proctor ${proctor.username} unregistered successfully`);
    } catch(err) {
      logger.warn(
        `Proctor ${proctor.username} not unregistered successfully`
      )
      throw AuthenticationError(err);
    }
  }
  
  async unregisterAdministrator(id) {
    try {
      const administrator = await Administrator.findOne({
      where: { id: id }
    });
    if (!administrator) {
      logger.warn(`Administrator ${username} not found, cannot unregister`);
      throw new AuthenticationError("Administrator not found");
    }
    await administrator.destroy();
    logger.log("info", `Administrator ${username} unregistered successfully`);
  } catch(err) {
    logger.warn(
      `Administrator ${username} not unregistered successfully`
    )
    throw AuthenticationError(err);
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
      let proctor = await Proctor.findOne({
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
      id: proctor.id,
      role: "proctor"
    }
      return Authenticator.createToken(payload);
  }

  async loginExaminee(username, password) {
    let examinee = await Examinee.findOne({
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
      id: examinee.id,
      role: "examinee"
    }
    return Authenticator.createToken(payload);
  }

  async loginAdministrator(username, password) {
    let administrator = await Administrator.findOne({
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
      id: administrator.id,
      role: "administrator"
    }
    return Authenticator.createToken(payload);
  }
  static defaultAuthenticator = new Authenticator (require("../db/index"));
}
module.exports = Authenticator;
