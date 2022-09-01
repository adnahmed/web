const neo4j = require("../../src/db/neo4j");
const cypher = require("../../src/db/cypher");
module.exports = {
    setupDB: () => {
        switch (process.env.NEO4J_ENTERPRISE.toLowerCase()) {
            case "true":
                neo4j.write(cypher("create-or-replace-db"));
            case "false":
                neo4j.write(cypher("delete-all-nodes-and-relationships"))
        }
    }
}
