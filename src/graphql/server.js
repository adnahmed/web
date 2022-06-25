const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const { loadFiles } = require('@graphql-tools/load-files')
const { mergeResolvers } = require('@graphql-tools/merge')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars')
const { resolvers: scalarResolvers } = require('graphql-scalars')
const { print } = require('graphql')
const jwt = require('jsonwebtoken')
const path = require('path')
const passport = require('passport')
const { CLIENT_RENEG_WINDOW } = require('tls')

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
            req.headers.authorization = req.headers.authorization || ''
            req.headers.authorization = 'Bearer ' + req.headers.authorization
            var res =  passport.authenticate(
              ['administrator', 'proctor', 'examinee'],
              { session: false },
              
          )(req);
          return res;
          },
    })
    return server
})()
