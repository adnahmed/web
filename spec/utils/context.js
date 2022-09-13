require('./graphqlEndpoint')
const neo4j = require("../../src/db/neo4j")
const { request, GraphQLClient } = require('graphql-request')
const { register, loginUsername } = require('../utils/queries')
const { user } = require('../utils/constants')
const graphql = require('../../src/graphql/server')
const { instance } = require("../../src/db/neo4j")
const fs = require('fs')
const path = require('path')
var express;
module.exports = {
    setupDB: async () => {
        const files = fs.readdirSync(path.resolve('src/db/models'))
        files.forEach(async (file) => {
            file = file.replace('.js', '')
            const records = await instance.all(file)
            if (records.length > 0) 
                await instance.deleteAll(file)
        })
    },
    api: () => {
        express = require('../../server')
    },
    shutdown: () => {
        graphql.stop().then(() => {
            express.stop()
        })
    },
    registerFakeAccount: async () => {
        await request(process.env.GraphQLEndpoint, register, { user })
    },
    getAuthenticatedAccount: async () => {
        const loggedInUser = await request(process.env.GraphQLEndpoint, loginUsername, {
                username: user.username,
                password: user.password
            })
        const authenticatedClient = new GraphQLClient(process.env.GraphQLEndpoint)
        authenticatedClient.setHeader('authorization', loggedInUser.logInUsername.token)
        return authenticatedClient
    },
}
