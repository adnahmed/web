const authenticator = require('../../lib/Authenticator').defaultAuthenticator;
module.exports = {
    Query: {
        async getAdministrator(parent,args, context) {
            if (!context.user || !context.user.role == 'administrator') return null;
            return context.user;
        }
        
    }
}