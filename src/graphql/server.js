const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { loadFiles } = require('@graphql-tools/load-files')
const { mergeResolvers } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const { print, getIntrospectionQuery } = require('graphql')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret
const path = require('path')
//const { getUser } = require('../lib/getter')
const logger = require('../logger')

module.exports = (async () => {
    const server = new ApolloServer({
        resolvers: {
            ...mergeResolvers(
                await loadFiles(path.join(__dirname, './resolvers/**/*.js'))
            ),
            ...scalarResolvers,
        },
        typeDefs:
            print(
                await loadFiles(path.join(__dirname, './typedefs/**/*.graphql'))
            ) + scalarTypeDefs,
        csrfPrevention: true,
        cache: 'bounded',
        context: async ({ req }) => {
            if (!req.headers.authorization) return
            try {
                const decrypt = jwt.verify(req.headers.authorization, secret)
                try {
                    const user = await getUser(decrypt, req.ip);

                    if (!user)
                        throw new AuthenticationError(
                            `${decrypt.role}: ${decrypt.sub} not Found.`
                        )
                    return { user, role: decrypt.role }
                } catch (err) {
                    logger.info(err)
                }
            } catch (err) {
                logger.warn(`Invalid token: ${req.headers.authorization} from ${req.ip}`);
            }
        },
    })
    return server
})()
