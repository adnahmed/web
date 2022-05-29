const queries = require('../queries/admin');
const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const errors = require('../db/errors');
class AuthenticationError extends Error {}
class JWTError extends Error {}
class Authenticator {

    constructor(pool){
        this.pool = pool;
    }
    static verifyAndReturnPayload(token) {        
        return new Promise((resolve, reject) => {
            jwt.verify(token, config.secret, (err, decoded)=> {
                if(err) reject(err);
                resolve(decoded);
            });
        });
    }
    static createToken(payload) {
        var options = {}
        if (!payload.exp) options = {expiresIn: '1w'};

        return new Promise((resolve, reject) => {
            jwt.sign(payload, config.secret, options ,(err, token) => {
                if (err) reject(new JWTError(err));
                resolve(token);
            });
        })
    }

    static async encryptPayload(payload) {
        return await bcrypt.hash(payload, config.saltRounds);
    }

    async registerAdministrator(administrator) {
        try{
            let res = await this.pool.query(queries.insert.usernamePasswordReturning, [administrator.username, await Authenticator.encryptPayload(administrator.password)]);
            return Authenticator.createToken(res.rows[0]);
        } catch (err) {
            if(err.code == errors.DUPLICATE_KEY_VALUE) throw new AuthenticationError('Username already exists');
            throw new AuthenticationError(err);
        }
    }

}
module.exports = Authenticator;