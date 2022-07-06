const logger = require('../../logger/index')
const neo4j = require('../../neo4j')
const errorHandler = require('../../middleware/neo4j-error-handler')
const cypher = require('../../cypher/index')
const bcrypt = require('bcrypt')
const config = require('../../config')
const jwt = require('jsonwebtoken')
module.exports = {
    Query: {
        async logIn(parent, args, context) {
            try {
                const userPasswordRes = await neo4j.read(
                    cypher(`get-user-password-by-username`),
                    {
                        username: args.username,
                    }
                )
                const hashedPassword = userPasswordRes.records[0].get(0)
                try {
                    const isSame = await bcrypt.compare(
                        args.password,
                        hashedPassword
                    )
                    if (!isSame)
                        return {
                            code: 403,
                            message: 'Invalid Username or Password',
                            success: false,
                        }
                    try {
                        const userRes = await neo4j.read(
                            cypher(`get-user-by-username`),
                            { username: args.username }
                        )
                        const payload = {
                            user: userRes.records[0].get(0).properties,
                            labels: userRes.records[0].get(0).labels,
                        }
                        try {
                            const token = await jwt.sign(payload, config.secret)
                            return {
                                code: 200,
                                message: 'Login Success',
                                success: true,
                                token: token,
                                user: payload.user,
                            }
                        } catch (err) {
                            logger.warn(
                                `JWT could not be signed, payload: ${payload}`
                            )
                            return {
                                code: 500,
                                message: 'Internal Server Error',
                                success: false,
                            }
                        }
                    } catch (err) {
                        return {
                            code: 500,
                            message: `Internal Error, Could not Fetch User ${args.username}`,
                            success: false,
                        }
                    }
                } catch (err) {
                    logger.warn(
                        `bcrypt error comparing password: ${hashedPassword} with ${args.password}`
                    )
                    return {
                        code: 500,
                        message: 'Internal Error',
                        success: 'false',
                    }
                }
            } catch (err) {
                logger.warn(
                    `Neo4j Error: Could not retrieve username: ${args.username}`
                )
                return errorHandler(err)
            }
        },
    },
    Mutation: {
        async register(parent, args, context) {
            if (!['administrator', 'examinee', 'proctor'].includes(args.role))
                return {
                    code: 400,
                    message:
                        'Unknown Role provided. Must be one of [ administrator, proctor, examinee ]',
                    success: false,
                }
            if (arg.role == 'administrator' && !args.organization) {
                return {
                    code: 400,
                    message:
                        'Organization must be provided for administrator registeration.',
                    success: false,
                }
            }
            /* Queries expect parameter and throw error for null */
            args.password = args.password || ''
            args.prefix = args.prefix || ''
            args.middle_name = args.middle_name || ''
            args.last_name = args.last_name || ''
            try {
                const hashedPassword = await bcrypt.hash(
                    args.password,
                    config.saltRounds
                )

                args.password = hashedPassword
                try {
                    const res = await neo4j.write(
                        cypher(`create-user-${args.role}`),
                        args
                    )

                    if (args.role == 'administrator') {
                        await neo4j.write(
                            cypher('create-administrator-organization-relationship', args)
                        );
                    }

                    const payload = {
                        user: res.records[0].get(0).properties,
                        labels: res.records[0].get(0).labels,
                    }
                    try {
                        const token = await jwt.sign(payload, config.secret)

                        return {
                            code: 200,
                            message: 'Registeration Success',
                            success: true,
                            token: token,
                            user: payload.user,
                        }
                    } catch (err) {
                        logger.warn(
                            `JWT could not be signed, payload: ${payload}`
                        )
                        return {
                            code: 500,
                            message: 'Internal Server Error',
                            success: false,
                        }
                    }
                } catch (err) {
                    return errorHandler(err)
                }
            } catch (err) {
                logger.warn(`Could not hash given password: ${args.password}`)
                return {
                    code: 500,
                    message: 'Internal Server Error',
                    success: false,
                }
            }
        },
    },
}
