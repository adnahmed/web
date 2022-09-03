const logger = require('../../logger/index')
const neo4j = require('../../db/neo4j')
const cypher = require('../../db/cypher/index')

module.exports = {
    Query: {
        async getProctors(parent, args, context) {
            try {
               if (context.role != "administrator") return {
                code: 403,
                success: false,
                message: "Only Administrator are allowed to fetch Proctors."
               } 
               const proctorResp = await neo4j.read(cypher("get-proctor-managed-by-admin"), context)
               return {
                code: 200,
                success: true,
                Users: proctorResp.records
               }
            } catch (err) {
                logger.warn(`Error Occurred while fetching proctor records: ${err}`);
            }
        }
    }
}