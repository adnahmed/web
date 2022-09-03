const config = require('./src/config');
const app = require('./src/app');
const server = require("./src/graphql/server");
const terminusOptions = require('./src/terminus');
const { createTerminus } = require('@godaddy/terminus');
const http = require('http');
const api = http.createServer(app).listen(config.port)
api.on('listening', () => {
    console.log(`Express Server is listening on port ${config.port}`);
    server.start().then(()=> {
        server.applyMiddleware({ app: app })
        console.log("GraphQL Server started.")
    })
}) 
createTerminus(api, terminusOptions)
module.exports = api;


