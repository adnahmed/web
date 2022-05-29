const queries = require('../queries/admin');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

class AuthenticationError extends Error {}
class JWTError extends Error {}
class Authenticator {

    constructor(pool){
        this.pool = pool;
    }
    static verifyAndReturnPayload(token) {        
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded)=> {
                if(err) reject(err);
                return resolve(decoded);
            });
        })
    }
    static createToken(payload) {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, (err, token) => {
                if (err) reject(new JWTError(err));
                resolve(token);
            })
        })
    }
    async registerAdministrator(administrator) {
        try{
            let res = await this.pool.query(queries.insertAdministratorReturning, [administrator.username, administrator.password]);
            return Authenticator.createToken(res.rows[0]);
        } catch (err) {
            throw new AuthenticationError(err);
        }
    }

}
module.exports = Authenticator;