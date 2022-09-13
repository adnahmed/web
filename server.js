require('./src/import-config')
const app = require('./src/app')
const server = require("./src/graphql/server")
const terminusOptions = require('./src/terminus')
const { createTerminus } = require('@godaddy/terminus')
const http = require('http')
const api = http.createServer(app).listen(process.env.PORT)

api.on('listening', () => {
    console.log(`Express Server is listening on port ${process.env.PORT}`)
}) 

server.start().then(()=> {
    server.applyMiddleware({ app: app })
    console.log("GraphQL Server started.")
})

createTerminus(api, terminusOptions)
module.exports = api;