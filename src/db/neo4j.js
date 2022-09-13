const logger = require('../logger');
const neode = require("neode");
const instance = neode.fromEnv(process.env.NEO4J_PATH || ".neode.env.dev")
    .withDirectory(__dirname + '/models')

module.exports = {
    read: async (cypher, params = {}) => {
        const session = instance.readSession(process.env.NEO4J_DATABASE)
        try {
            const res = await session.run(cypher, params)
            return res
        } catch (err) {
            // TODO: Logging Service
            logger.error(`${new Date},${err.code},${err.message}`)
            throw err
        }
        finally {
            session.close()
        }
    },
    write: async (cypher, params = {}) => {
        const session = instance.writeSession(process.env.NEO4J_DATABASE);
        try {
            const res = await session.run(cypher, params)
            return res
        } catch (err) {
            throw err
        }
        finally {
            session.close()
        }
    },
    batch: async (queries) => {
        try {
            const res = await instance.batch(queries)
        } catch (err) {
            throw e
        }
    }
    ,instance
}
