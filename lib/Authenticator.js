const queries = require('../queries/admin');
class AuthenticationError extends Error {}

class Authenticator {

    constructor(pool){
        this.pool = pool;
    }

    async registerAdministrator(administrator) {
        try{
            let res = await this.pool.query(queries.insertAdministratorReturning, [administrator.username, administrator.password]);
            return res.rows[0];
        } catch (err) {
            throw new AuthenticationError(err);
        }
    }

}
module.exports = Authenticator;