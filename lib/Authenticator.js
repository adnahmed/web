class AuthenticationError extends Error {}

class Authenticator {

    constructor(pool){
        this.pool = pool;
    }

    registerAdministrator(administrator) {
        throw(new AuthenticationError("Administrator is already registered"));    
    }

}
module.exports = Authenticator;