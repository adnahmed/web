const logger = require('../../logger/index')
const Filter = require('bad-words')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const config = require('../../config')
const jwt = require('jsonwebtoken')
const {
    RoleFetchError,
    checkExisting,
    getUserRole,
    ErrorResponse,
    EmailError,
    checkExistingEmail,
} = require('../auth_utils')
const { instance } = require('../../db/neo4j')
module.exports = {
    Query: {
        async logInUsername(parent, args, context) {
            try {
                const user = await checkExistingUsername(args.username, false)
                return await logIn(user, args.password, context)
            } catch (err) {
                if (err instanceof UsernameError) return new ErrorResponse(err)
                return neo4jErrorHandler(err)
            }
        },
        async logInEmail(parent, args, context) {
            try {
                const user = await checkExistingEmail(args.email)
                return await logIn(user, args.password, context)
            } catch (err) {
                if (err instanceof EmailError) return new ErrorResponse(err)
                return neo4jErrorHandler(err)
            }
        },
    },
    Mutation: {
        async register(parent, args, context) {
            try {
                args.user.password = await hashValue(args.user.password)
                validateUser(args.user)
                await checkExisting(args.user)
                const user = await instance.create('User', args.user)
                const org = await instance.create('Organization', {
                    name: args.user.organization,
                })
                await user.relateTo(org, 'belongs_to')
                return await prepareAuthenticationResponse(
                    {
                        ...args.user,
                        id: user.get('id'),
                    },
                    'Registeration Successful'
                )
            } catch (err) {
                logger.warn(`${context.req.ip}: ${err.message}`)
                return new ErrorResponse(err)
            }
        },
    },
}

function validateUser(user) {
    const schema = Joi.object()
        .keys({
            username: Joi.string().alphanum().min(3).required(),
            email: Joi.string().email({ minDomainSegments: 2 }),
            createdAt: Joi.forbidden(),
        })
        .with('username', 'email')

    var filter = new Filter()
    var profanityFoundIn = (field, value) => {
        return `Profanity found in ${field}: ${value}\n`
    }
    var errorMessage = ``
    const result = Joi.validate(
        { username: user.username, email: user.email },
        schema
    )
    if (filter.isProfane(user.username))
        errorMessage += profanityFoundIn('username', user.username)
    if (filter.isProfane(user.prefix))
        errorMessage += profanityFoundIn('prefix', user.prefix)
    if (filter.isProfane(user.givenName))
        errorMessage += profanityFoundIn('givenName', user.givenName)
    if (filter.isProfane(user.middleName))
        errorMessage += profanityFoundIn('middleName', user.middleName)
    if (filter.isProfane(user.lastName))
        errorMessage += profanityFoundIn('lastName', user.lastName)
    if (filter.isProfane(user.organization))
        errorMessage += profanityFoundIn('organization', user.organization)
    if (result.error)
        result.error.details.forEach((detail) => {
            errorMessage += `${detail.message}\n`
        })
    if (errorMessage.length == 0 && !result.error) return true
    throw new ValidationError(errorMessage)
}
class ValidationError extends Error {
    constructor(message) {
        super()
        this.code = 400
        this.message = message
    }
}

async function verifyPassword(provided, ground) {
    if (!(await bcrypt.compare(provided, ground))) throw new PasswordError()
}

async function hashValue(payload) {
    try {
        return await bcrypt.hash(payload, config.saltRounds)
    } catch (err) {
        throw new HashError(payload, err)
    }
}

async function prepareAuthenticationResponse(user, authMessage) {
    delete user.createdAt
    delete user.password
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
        super()
        this.code = 500
        this.message = `JWT could not be signed, payload: ${payload}`
    }
}

class PasswordError extends Error {
    constructor() {
        super()
        this.code = 403
        this.message = 'Invalid Password Provided'
    }
}
class HashError extends Error {
    constructor(value, err) {
        super()
        this.code = 500
        this.message = `Could not Hash Given value: ${value}, Error: ${err.message}`
    }
}

async function logIn(user, password, context) {
    try {
        await verifyPassword(password, user.password)
        user.role = await getUserRole(user.username)
        return await prepareAuthenticationResponse(user, 'Login Successful')
    } catch (err) {
        logger.warn(`${context.req.ip}: ${err.message}`)
        if (err instanceof PasswordError || err instanceof RoleFetchError) {
            return {
                code: err.code,
                message: err.message,
                success: false,
            }
        }
        return neo4jErrorHandler(err)
    }
}
