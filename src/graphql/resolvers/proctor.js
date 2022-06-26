const logger = require('../../logger')
const authenticator = require('../../lib/Authenticator').defaultAuthenticator
module.exports = {
    Mutation: {
        async registerProctor(parent, args, context) {
            var response = {}
            if (context.user && context.role == 'administrator') {
                try {
                    response.user =
                        await authenticator.registerUserForAdministrator(
                            context.user,
                            args.username,
                            args.password,
                            args.first_name,
                            args.middle_name,
                            args.last_name,
                            role
                        )
                    response.code = 200
                    response.message = 'Proctor registered successfully'
                    response.success = true
                    return response
                } catch (err) {
                    logger.warn(`Error: ${err.message}`)
                    response.code = err.code;
                    response.message = err.message
                    response.success = false
                    response.user = null
                }
            } else {
                logger.warn(`Unauthenticated Register Proctor Request`)
                response.code = 403
                response.message =
                    'You are not authorized to register a proctor, \
                                    login as administrator and try again'
                response.success = false
                response.user = null
            }
        },
    },
}
