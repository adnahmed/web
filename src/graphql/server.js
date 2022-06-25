const { ApolloServer, AuthenticationError } = require('apollo-server-express');
const { loadFiles } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');
const { resolvers: scalarResolvers } = require('graphql-scalars');
const { print, getIntrospectionQuery } = require('graphql');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;
const path = require('path');
const { getUser } = require('../lib/getter');

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
        context: ({ req }) => {
            if (!req.headers.authorization) return;
            try {
                const decrypt = jwt.verify(req.headers.authorization, secret);
                return { user: getUser(decrypt), role: decrypt.role }
            } catch (err) {
                throw new AuthenticationError("Invalid Token");
            }
        },
    })
    return server
})();
