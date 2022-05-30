const adminQueries = require("../queries/admin");
const examineeQueries = require("../queries/examinee");
const proctorQueries = require('../queries/proctor');
const jwt = require("jsonwebtoken");
const config = require("../config");
const bcrypt = require("bcrypt");
const errors = require("../db/errors");
class AuthenticationError extends Error {}
class JWTError extends Error {}
class Authenticator {
  constructor(pool) {
    this.pool = pool;
  }
  static verifyAndReturnPayload(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }
  static createToken(payload) {
    var options = {};
    if (!payload.exp) options = { expiresIn: "1w" };

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

  async registerAdministrator(administrator) {
    try {
      let res = await this.pool.query(
        adminQueries.insert.usernamePasswordNameReturning,
        [
          administrator.username,
          await Authenticator.encryptPayload(administrator.password),
          administrator.first_name,
          administrator.last_name,
        ]
      );
      return Authenticator.createToken(res.rows[0]);
    } catch (err) {
      if (err.code == errors.DUPLICATE_KEY_VALUE)
        throw new AuthenticationError("Username already exists");
      throw new AuthenticationError(err);
    }
  }
  async verifyAdministratorAndRegisterDependents (administratorToken, query, dependent) {
    try {
      let decoded = await Authenticator.verifyAndReturnPayload(
        administratorToken
      );
      let res = await this.pool.query(
        query,
        [
          decoded.administrator_id,
          dependent.username,
          await Authenticator.encryptPayload(dependent.password),
          dependent.first_name,
          dependent.last_name,
        ]
      );
      return Authenticator.createToken(res.rows[0]);
    } catch (err) {
      if (err.code == errors.DUPLICATE_KEY_VALUE)
        throw new AuthenticationError("Username already exists");
      throw new AuthenticationError(err);
    }
  }

  async registerProctor(proctor, administratorToken) {
    return await this.verifyAdministratorAndRegisterDependents (administratorToken, proctorQueries.insert.usernamePasswordNameReturning, proctor);
  }
  async registerExaminee(examinee, administratorToken) {
    return await this.verifyAdministratorAndRegisterDependents (administratorToken, examineeQueries.insert.usernamePasswordNameReturning, examinee);
  }
  async verifyPassword(plainTextPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainTextPassword, hashedPassword, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
  async loginProctor(proctor) {
    return await this.searchAndValidateCredentials(
      proctorQueries.select.administratorUsernamePasswordWhereUsername,
      proctor
    );
  }
  
  async loginExaminee(examinee) {
    return await this.searchAndValidateCredentials(
      examineeQueries.select.administratorUsernamePasswordWhereUsername,
      examinee
    );
  }

  async loginAdministrator(administrator) {
    return await this.searchAndValidateCredentials(
      adminQueries.select.usernamePasswordWhereUsername,
      administrator
    );
  }
  async searchAndValidateCredentials(query, user) {
    let res = await this.pool.query(query, [user.username]);
    if (res.rowCount == 0) {
      throw new AuthenticationError("Username not Found");
    }
    let storedHashedPassword = res.rows[0].password;
    let isSamePassword = await this.verifyPassword(
      user.password,
      storedHashedPassword
    );
    if (isSamePassword) return await Authenticator.createToken(res.rows[0]);
    else throw new AuthenticationError("Invalid Credentials");
  }
}
module.exports = Authenticator;
