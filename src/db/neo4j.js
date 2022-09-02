const logger = require('../logger');
const neode = require("neode");
const config = require("../config").neo4j;
const instance = neode.fromEnv(config.path)
    .withDirectory(__dirname + '/models')

module.exports = {
    read: (cypher, params = {}) => {
        return instance.cypher(cypher, params)
            .then((res) => {
                return res
            })
            .catch((e) => {
                throw e
            })
    },
    write: (cypher, params = {}) => {
        const session = instance.writeSession(process.env.NEO4J_DATABASE);
        session.run(cypher, params)
            .then((res) => {
                session.close();
                return res
            })
            .catch((e) => {
                session.close();
                throw e
            })
    },
    batch: (queries) => {
        return instance.batch(queries)
            .then((res) => {
                return res
            })
            .catch((e) => {
                throw e
            })
    }
    , instance
}
