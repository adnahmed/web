const authenticator = require('../../lib/Authenticator').defaultAuthenticator;
const logger = require('../../logger/index');
module.exports = {
    User: {
        __resolveType(user, context, info) {
            
        }
    },
    Query: {
        async loginOther(parent, args, context) {
            var response = {};
            try {
                response.token = await authenticator.loginOther(args.username, args.password, args.role, args.administratorUsername);
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
        async loginAdministrator(parent, args, context) {
            var response = {};
            try {
                response.token = await authenticator.loginAdministrator(args.username, args.password);
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
        }
    },
    Mutation: {
        async registerAdministrator(parent, args, context) {
            var response = {}
            try {
                response.user = await authenticator.registerAdministrator(args.username, args.password, args.first_name, args.middle_name, args.last_name)
                response.code = 200
                response.message = 'Administrator registered successfully'
                response.success = true
                return response
            } catch (err) {
                logger.warn(`Error: ${err.message}`)
                if (err.code) response.code = err.code;
                else response.code = 500
                if (err.message) response.message = err.message
                else response.message = "Internal Server Error"
                response.success = false
                response.user = null
                return response;
            }
        },
        async registerOther(parent, args, context) {
            var response = {}
            try {
                response.user = await authenticator.registerOther(args.username, args.password, args.first_name, args.middle_name, args.last_name, args.role, args.administratorUsername)
                response.code = 200
                response.message = 'Administrator registered successfully'
                response.success = true
                return response
            } catch (err) {
                logger.warn(`Error: ${err.message}`)
                if (err.code) response.code = err.code;
                else response.code = 500
                if (err.message) response.message = err.message
                else response.message = "Internal Server Error"
                response.success = false
                response.user = null
                return response;
            }
        }
    }
};