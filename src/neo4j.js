const neo4j = require('neo4j-driver');
const logger = require('./logger');
const config = require('./config').neo4j;
const driver = neo4j.driver(config.url, neo4j.auth.basic(config.username, config.password));
(async () => {
    var retryTime = 0;
    var connectionSuccessful = false;
    while(!connectionSuccessful && !retryTime > config.MAX_CONNECTION_RETRY) {
        try {
            await driver.verifyConnectivity()
            connectionSuccessful = true;
            console.log('Neo4j Driver created')
            console.log('Startup Setup For Neo4j');
            require('./cypher/startup-setup');
        } catch (error) {
            console.log(`Retry: ${retryTime}, Connectivity verification failed. ${error}`)
            if(retryTime == config.MAX_CONNECTION_RETRY) {
                logger.warn(`${Date.now()} : Unable to connect to db on startup with error: ${error} `)
                throw new Error("Unable to connect to Neo4j. Please start db server to continue.")
            }
            retryTime += 1;
            await new Promise(resolve => setTimeout(resolve, Math.min(5000, config.RECONNECT_TIME * retryTime)));
        }
    }
})();

module.exports = {
    read: (cypher, params = {}, database = config.database) => {
        const session = driver.session({
            defaultAccessMode: neo4j.session.READ,
            database,
        })

        return session.run(cypher, params)
            .then(res => {
                session.close()
                return res
            })
            .catch(e => {
                session.close()
                throw e
            })
    },
    write: (cypher, params = {}, database = config.database) => {
        const session = driver.session({
            defaultAccessMode: neo4j.session.WRITE,
            database,
        })

        return session.run(cypher, params)
            .then(res => {
                session.close()
                return res
            })
            .catch(e => {
                session.close()
                throw e
            })
    },
}