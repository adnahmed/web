const logger = require('../../logger/index')
const Filter = require('bad-words')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    checkExisting,
    RegisterationError,
    AuthenticationError
} = require('../auth_utils')
const { ErrorQueryResponse, OKQueryResponse } = require('../utils')
const { instance, read } = require('../../db/neo4j')
module.exports = {
    Query: {
        async logInUsername(parent, args, context) {
            try {
                const user = await checkExisting({username: args.username})
                if(!user) {
                    throw new AuthenticationError()
                }
                return await logIn(user, args.password)
            } catch (err) {
                return { queryResponse: new ErrorQueryResponse(err) }
            }
        },
        async logInEmail(parent, args, context) {
            try {
                const user = await checkExisting({email: args.email})
                if(!user) {
                    throw new AuthenticationError()
                }
                return await logIn(user, args.password)
            } catch (err) {
                return { queryResponse: new ErrorQueryResponse(err) }
            }
        },
    },
    Mutation: {
        async register(parent, args, context) {
            try {
                args.user.password = await bcrypt.hash(args.user.password, parseInt(process.env.SALT_ROUNDS))
                validateUser(args.user)
                if (await checkExisting(args.user))
                    throw new RegisterationError(args.user.username, args.user.email)
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
                return { queryResponse: new ErrorQueryResponse(err) }
            }
        },
    },
}

function validateUser(user) {
    /* Setup */
    const schema = Joi.object()
        .keys({
            username: Joi.string().alphanum().min(3).required(),
            email: Joi.string().email({ minDomainSegments: 2 }),
            createdAt: Joi.forbidden(),
        })
        .with('username', 'email')

    var filter = new Filter()
    var profanityFoundIn = (field, value) => {
        field = field.replace('organization', 'Organization')
        field = field.replace('givenName', 'Given Name')
        field = field.replace('lastName', 'Last Name')
        field = field.replace('middleName', 'Middle Name')
        field = field.replace('prefix', 'Prefix')
        field = field.replace('username', 'Username')
        field = field.replace('email', 'Email Address')
        return `Please avoid using using profanity in ${field}.\n`
    }
    var errorMessage = ``

    /* Operation */
    const result = Joi.validate(
        { username: user.username, email: user.email },
        schema
    )
    for (const [key, value] of Object.entries(user)) {
        if(filter.isProfane(value))
            errorMessage += profanityFoundIn(`${key}`, value)
    }
    if (result.error)
    result.error.details.forEach((detail) => {
            errorMessage += `${detail.message}\n`
    })

    /* Result */
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

async function prepareAuthenticationResponse(user, authMessage) {
    delete user.createdAt
    delete user.password
    const payload = {
        sub: user.username,
        role: user.role,
    }
    const token = await jwt.sign(payload, process.env.SECRET)
    const builder = instance.query();
    const PictureRecords = await builder.match('p', 'Picture').relationship('belongs_to', 'out').to('u','User').where('u.id', user.id).return('p').execute()
    user.pictures = []
    PictureRecords.records.forEach(record => {
        user.pictures.push(record.get('id'))
    })
        return {
            queryResponse: new OKQueryResponse(authMessage),
            success: true,
            token: token,
            user: user,
        }
}
class PasswordError extends Error {
    constructor() {
        super()
        this.code = 403
        this.message = 'Invalid Password Provided.'
    }
}

async function logIn(user, password) {
    await verifyPassword(password, user.get('password'))
    return await prepareAuthenticationResponse(user.properties(), 'Login Successful')
}
