const { ApolloServer } = require("apollo-server-express");
const { loadFiles } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');
const { typeDefs: scalarTypeDefs } = require('graphql-scalars');
const { resolvers: scalarResolvers } = require('graphql-scalars');
const { print }  = require('graphql');
const path = require('path');

module.exports = (async()=> {
const server = new ApolloServer({
  typeDefs: print(await loadFiles(path.join(__dirname, './typedefs/**/*.graphql'))) + scalarTypeDefs,
  resolvers: {...mergeResolvers(await loadFiles(path.join(__dirname,'./resolvers/**/*.js'))), ...scalarResolvers},
  csrfPrevention: true,
  cache: "bounded",
}); 
  return server
})();