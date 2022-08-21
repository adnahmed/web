const logger = require('../../logger/index')
const neo4j = require('../../db/neo4j')
const neo4jErrorHandler = require('../../middleware/neo4j-error-handler');
const cypher = require('../../db/cypher/index')
const bcrypt = require('bcrypt')
const config = require('../../config')
const jwt = require('jsonwebtoken')
const { RoleFetchError, UsernameError, checkExistingUsername, getUserRole, ErrorResponse, EmailError, checkExistingEmail } = require('../auth_utils');
module.exports = {
    Query: {
        async logInUsername(parent, args, context) {
            try {
                const user = await checkExistingUsername(args.username, false)
                return await logIn(user, args.password, context);
            } catch (err) {
                if (err instanceof UsernameError)
                    return new ErrorResponse(err);
                return neo4jErrorHandler(err);
            }
        },
        async logInEmail(parent, args, context) {
            try {
                const user = await checkExistingEmail(args.email);
                return await logIn(user, args.password, context);
            } catch (err) {
                if (err instanceof EmailError)
                    return new ErrorResponse(err);
                return neo4jErrorHandler(err);
            }
        },
    },
    Mutation: {
        async register(parent, args, context) {
            /********************** */
            /*
            const rolesAllowed = ['administrator', 'examinee', 'proctor']
            if (!rolesAllowed.includes(args.user.role))
                return {
                    code: 400,
                    message: `Unknown Role provided. Must be one of: ${rolesAllowed}`,
                    success: false,
                }
                */
            /********************** */

            /* Queries expect parameter and throw error for null */
            args.user.prefix = args.user.prefix || ''
            args.user.middleName = args.user.middleName || ''
            args.user.lastName = args.user.lastName || ''

            try {
                args.user.password = await hashValue(args.user.password)
                await checkExistingUsername(args.user.username, true)
                await neo4j.write(cypher(`create-user`), args.user)
                await neo4j.batch([
                    {
                        query: cypher(`create-role-user-relationship`),
                        params: args.user
                    }, {
                        query: cypher(`create-organization-user-relationship`),
                        params: { username: args.user.username, organization: args.user.organization }
                    }
                ]);
                return await prepareAuthenticationResponse(
                    args.user,
                    'Registeration Successful'
                )
            } catch (err) {
                logger.warn(`${context.req.ip}: ${err.message}`);
                if (
                    err instanceof HashError ||
                    err instanceof JWTSignError ||
                    err instanceof UsernameError
                ) return new ErrorResponse(err);
                else return neo4jErrorHandler(err)
            }
        },
    },
}

async function verifyPassword(provided, ground) {
    if (! await bcrypt.compare(provided, ground))
        throw new PasswordError;
}



async function hashValue(payload) {
    try {
        return await bcrypt.hash(payload, config.saltRounds)
    } catch (err) {
        throw new HashError(payload, err)
    }
}

async function prepareAuthenticationResponse(user, authMessage) {
    delete user.createdAt;
    delete user.password;
    const payload = {
        sub: user.username,
        role: user.role,
    }
    try {
        const token = await jwt.sign(payload, config.secret)
        return {
            code: 200,
            message: authMessage,
            success: true,
            token: token,
            user: user,
        }
    } catch (err) {
        throw JWTSignError(payload)
    }
}

class JWTSignError extends Error {
    constructor(payload) {
        super();
        this.code = 500;
        this.message = `JWT could not be signed, payload: ${payload}`;
    }
}

class PasswordError extends Error {
    constructor() {
        super();
        this.code = 403;
        this.message = "Invalid Password Provided";
    }
}
class HashError extends Error {
    constructor(value, err) {
        super();
        this.code = 500;
        this.message = `Could not Hash Given value: ${value}, Error: ${err.message}`;
    }
}

async function logIn(user, password, context) {
    try {
        await verifyPassword(password, user.password)
        user.role = await getUserRole(user.username);
        return await prepareAuthenticationResponse(
            user,
            'Login Successful'
        )
    } catch (err) {
        logger.warn(`${context.req.ip}: ${err.message}`);
        if (
            err instanceof PasswordError ||
            err instanceof RoleFetchError
        ) {
            return {
                code: err.code,
                message: err.message,
                success: false,
            }
        }
        return neo4jErrorHandler(err)
    }
}