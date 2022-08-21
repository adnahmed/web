const logger = require('../logger');
const neode = require("neode");
const instance = neode.fromEnv();

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
        return instance.cypher(cypher, params)
            .then((res) => {
                return res
            })
            .catch((e) => {
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
}
