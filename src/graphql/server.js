const { ApolloServer } = require('apollo-server-express')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeResolvers } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const { print } = require('graphql')
const depthLimit = require('graphql-depth-limit')
const path = require('path')
const logger = require('../logger')
const { getUser } = require('./auth_utils')
const permissions = require('./accessControl/permissions')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')
const cache = require('./cache')
const { KeyvAdapter } = require('@apollo/utils.keyvadapter')
const typeDefs = [
    print(loadFilesSync(path.join(__dirname, './typedefs/**/*.graphql'))),
    ...scalarTypeDefs,
]
const resolvers = {
    ...scalarResolvers,
    ...mergeResolvers(
        loadFilesSync(path.join(__dirname, './resolvers/**/*.js'))
    ),
}

const schema = applyMiddleware(
    makeExecutableSchema({ typeDefs, resolvers }),
    permissions
)

const server = new ApolloServer({
    schema: schema,
    csrfPrevention: true,
    cache: new KeyvAdapter(cache),
    context: async ({ req }) => {
        try {
            const { status, user } = await getUser(req)
            if (!status) return { req }
            return { user, req }
        } catch (err) {
            logger.warn(
                `${req.ip}: ${err.message}, Token: ${req.headers.authorization}`
            )
            return { req }
        }
    },
    validationRules: [
        depthLimit(
            10,
            {}, // ignore no fields
            (depth) => {
                if (depth >= 10) logger.warn(`Depth Limit Exceeded: ${depth}`)
            }
        ),
    ],
})

module.exports = server
