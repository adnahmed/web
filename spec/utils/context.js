const neo4j = require("../../src/db/neo4j")
const cypher = require("../../src/db/cypher")
const { request, GraphQLClient } = require('graphql-request')
const { register, loginUsername } = require('../utils/queries')
const { user } = require('../utils/constants')
const config = require('../../src/config').graphql
const graphql = require('../../src/graphql/server')
var express;
module.exports = {
    setupDB: () => {
        switch (process.env.NEO4J_ENTERPRISE.toLowerCase()) {
            case "true":
                neo4j.write(cypher("create-or-replace-db"))
            case "false":
                neo4j.write(cypher("delete-all-nodes-and-relationships"))
        }
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
        await request(config.endpoint, register, { user })
    },
    getAuthenticatedAccount: async () => {
        const loggedInUser = await request(config.endpoint, loginUsername, {
                username: user.username,
                password: user.password
            })
        const authenticatedClient = new GraphQLClient(config.endpoint)
        authenticatedClient.setHeader('authorization', loggedInUser.logInUsername.token)
        return authenticatedClient
    }
}
