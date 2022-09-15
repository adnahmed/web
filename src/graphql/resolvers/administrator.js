const logger = require('../../logger/index')
const neo4j = require('../../db/neo4j')
const cypher = require('../../db/cypher/index')
const { ErrorQueryResponse } = require('../utils')
module.exports = {
    Query: {
        async getProctors(parent, args, context) {
            try {
              const proctorResp = await neo4j.read(cypher("get-proctor-managed-by-admin"), context)
               return {
                code: 200,
                success: true,
                Users: proctorResp.records
               }
            } catch (err) {
                return new ErrorQueryResponse(err)
            }
        }
    }
}