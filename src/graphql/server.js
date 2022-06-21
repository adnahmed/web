const { ApolloServer } = require("apollo-server-express");
const { loadFiles } = require('@graphql-tools/load-files')
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');
const { resolvers: scalarResolvers } = require('graphql-scalars');
const path = require('path');
module.exports = (async()=> {
  const typeDefs = (await loadFiles(path.join(__dirname, './typedefs/**/*.graphql'))) + '\r\n' + scalarTypeDefs;
  const myResolvers = {
    Query: {
        books: () => books,
    },
}
  //await loadFiles('resolvers/**/*.js');
  const allResolvers = {...myResolvers, ...scalarResolvers};
  const resolvers = allResolvers;
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    csrfPrevention: true,
    cache: "bounded",
  }); 
  return server
})();
