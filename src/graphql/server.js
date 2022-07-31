const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { loadFiles } = require('@graphql-tools/load-files')
const { mergeResolvers } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const { print } = require('graphql')
const  depthLimit = require('graphql-depth-limit');
const jwt = require('jsonwebtoken')
const secret = require('../config').secret
const path = require('path')
const logger = require('../logger')

module.exports = (async () => {
    const server = new ApolloServer({
        resolvers: {
            ...scalarResolvers,
            ...mergeResolvers (
               await loadFiles(path.join(__dirname, './resolvers/**/*.js'))
            ),
        },
        typeDefs: [
            print(
                await loadFiles(path.join(__dirname, './typedefs/**/*.graphql'))
            ),
            ...scalarTypeDefs
        ],
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
        validationRules: [ depthLimit(
            10,
            {}, // ignore no fields
            depth => { if (depth >= 10) logger.warn(`Depth Limit Exceeded: ${depth}`)}
        ) ]
    })
    return server
})();
