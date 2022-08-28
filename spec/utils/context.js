const neo4j = require("../../src/db/neo4j");
const cypher = require("../../src/db/cypher");
module.exports = {
    setupDB: () => {
        neo4j.write(cypher("create-or-replace-db"));
    }
}
