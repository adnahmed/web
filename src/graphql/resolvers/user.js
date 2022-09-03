const logger = require('../../logger/index')
const neo4j = require('../../db/neo4j')
const neo4jErrorHandler = require('../../middleware/neo4j-error-handler');
const cypher = require('../../db/cypher/index')
const bcrypt = require('bcrypt')
const config = require('../../config')
const jwt = require('jsonwebtoken')
const { RoleFetchError, RegisterationError, checkExisting, getUserRole, ErrorResponse, EmailError, checkExistingEmail } = require('../auth_utils');
const { instance } = require('../../db/neo4j');
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
            /* Queries expect parameter and throw error for null */
            args.user.prefix = args.user.prefix || ''
            args.user.middleName = args.user.middleName || ''
            args.user.lastName = args.user.lastName || ''

            try {
                args.user.password = await hashValue(args.user.password)
                await checkExisting(args.user)
                const user = await instance.create('User', args.user)
                const org = await instance.create('Organization', {name: args.user.organization})
                await user.relateTo(org, 'belongs_to')
                return await prepareAuthenticationResponse(
                    {
                        ...args.user,
                        id: user.get("id")
                    },
                    'Registeration Successful'
                )
            } catch (err) {
                logger.warn(`${context.req.ip}: ${err.message}`);
                return new ErrorResponse(err);
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