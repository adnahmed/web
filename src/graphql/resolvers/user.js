const authenticator = require('../../lib/Authenticator').defaultAuthenticator;
module.exports = {
    Query: {
        async loginUser(parent, args, context) {    
            var response = {};
            try {
                response.token = await authenticator.loginUser(args.username, args.password, args.role);
                response.code = 200;
                response.message = "Login Successful";
                response.success = true;
                return response;
            }
            catch (err) {
                response.code = 403;
                response.message = err.message;
                response.success = false;
                response.token = null;
                return response;
            }
        },
    }
}