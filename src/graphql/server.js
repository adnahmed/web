const { ApolloServer } = require('apollo-server-express')
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
const { checkExistingUsername, getUserRole } = require("./utils");

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
        // TODO: Add Proper Error Handling.
        cache: 'bounded',
        context: async ({ req }) => {
            if (!req.headers.authorization) return { req }
            const payload = await jwt.verify(req.headers.authorization, secret)
                try {
                    if (!payload.sub || !payload.role){
                        logger.warn(`${req.ip}: Malformed JWT Token, ${req.headers.authorization}`);
                        return { req };
                    } 
                    const user = await getUser(payload.sub);
                    return { user, req };
            } catch (err) {
                logger.warn(`${req.ip}: ${err.message}, Token: ${req.headers.authorization}`);
                return { req };
            }
        },
        validationRules: [ depthLimit(
            10,
            {}, // ignore no fields
            depth => { if (depth >= 10) logger.warn(`Depth Limit Exceeded: ${depth}`)}
        )]
    })
    return server
})();

async function getUser(username) {
    // TODO: Use Redis Cache here to fetch user for username
    const user = await checkExistingUsername(username, false);
    user.role = await getUserRole (user.username);
    return user;
}