const { AuthenticationError } = require('apollo-server-express');
const { responsePathAsArray } = require('graphql');
const logger = require('../../logger');

const authenticator = require('../../lib/Authenticator').defaultAuthenticator;
module.exports = {
    Query: {
        async getAdministrator(parent,args, context) {
            if (!context.user || !context.user.role == 'administrator') 
            {
                logger.warn("Unauthorized request: getAdministrator");
                return;
            }
            return context.user;
        }
    },
    Mutation: {
        async registerAdministrator(parent, args, context) {
            var response = {}
            try {
                const admin = await authenticator.registerAdministrator(args.username, args.password, args.first_name, args.middle_name, args.last_name);
                response.code = 200;
                response.message = "Administrator registered successfully";
                response.success = true;
                response.user = admin;
            }
            catch (err) {
                response.code = err.code;
                response.message = err.message;
                response.success = false;
                response.user = null;
            }
            return response;
        }
    }
}