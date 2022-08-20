const process = require("process");
const neo4j = require('./neo4j')
const cypher = require('./cypher/index')
const fs = require('fs')
const path = require('path')
const logger = require('../logger')
const queriesPath = path.join(__dirname, "cypher")

const startupType = {
    constraints: 0,
    indexes: 1
}

async function setupDatabase() {
    await performStart(startupType.constraints);
    await performStart(startupType.indexes);
}

async function performStart(of) {
    var type = "";
    switch (of) {
        case startupType.constraints:
            type = /[\w-]+-constraint.cypher/
            break
        case startupType.indexes:
            type = /index[\w-]+.cypher/
            break
    }
    fs.readdir(queriesPath, null, async (err, files) => {
        if (err) errorHandler(err);
        for (file of files) {
            if (type.test(file))
                try {
                    await neo4j.write(cypher(path.basename(file, '.cypher')))
                } catch (err) {
                    errorHandler(err);
                }
        }
    });

}

function errorHandler(err) {
    logger.warn(err.message);
    if (process.env.NODE_ENV == "DEBUG")
        console.log(err.message);
    else throw err;
}

module.exports = setupDatabase