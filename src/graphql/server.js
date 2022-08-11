const { ApolloServer } = require('apollo-server-express')
const { loadFiles } = require('@graphql-tools/load-files')
const { mergeResolvers } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const { print } = require('graphql')
const depthLimit = require('graphql-depth-limit');
const path = require('path')
const logger = require('../logger')
const { getUser } = require("./auth_utils");

module.exports = (async () => {
    const server = new ApolloServer({
        resolvers: {
            ...scalarResolvers,
            ...mergeResolvers(
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
        // TODO: Add Proper Error Handling.
        cache: 'bounded',
        context: async ({ req }) => {
            try {
                const { status, user } = await getUser(req);
                if (!status) return { req };
                return { user, req };
            } catch (err) {
                logger.warn(`${req.ip}: ${err.message}, Token: ${req.headers.authorization}`);
                return { req };
            }
        },
        validationRules: [depthLimit(
            10,
            {}, // ignore no fields
            depth => { if (depth >= 10) logger.warn(`Depth Limit Exceeded: ${depth}`) }
        )]
    })
    return server
})();

