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
                if(userPasswordRes.records.length == 0) {
                    return {
                        code: 403,
                        message: 'Username not found.',
                        success: false,
                    }
                }
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
                        const roleRes = await neo4j.read(
                            cypher(`get-user-role`),
                            { username: args.username }
                        );
                        delete userRes.records[0].get(0).properties.password;
                        const payload = {
                            user: userRes.records[0].get(0).properties,
                            role: roleRes.records[0].get(0),
                        }

                        try {
                            const token = await jwt.sign(payload, config.secret)
                            return {
                                code: 200,
                                message: 'Login Success',
                                success: true,
                                token: token,
                                user: {
                                    ...payload.user,
                                    role: payload.role,
                                }
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
            const existingUsers = await neo4j.read(
                cypher('get-user-by-username'),
                args
            );
            if (existingUsers.records.length > 0) {
                return {
                    code: 403,
                    message: "Userame already exists",
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
                    const userCreateResponse = await neo4j.write(
                        cypher(`create-user`),
                        args
                    );
                    await neo4j.write(
                        cypher('create-user-organization-relationship'),
                        args
                    );
                    await neo4j.write(
                        cypher(`create-role-user-relationship`),
                        args
                    );
                    const payload = {
                        user: userCreateResponse.records[0].get(0).properties,
                        role: args.role,
                    }
                    try {
                        const token = await jwt.sign(payload, config.secret)
                        return {
                            code: 200,
                            message: 'Registeration Success',
                            success: true,
                            token: token,
                            user: {
                                ...payload.user,
                                role: payload.role
                            },
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
