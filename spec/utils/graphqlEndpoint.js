require('../../src/import-config')
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || '3001'
process.env.GraphQLEndpoint =  `http://${HOST}:${PORT}/graphql`