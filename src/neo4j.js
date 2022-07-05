const neo4j = require('neo4j-driver')
const config = require('./config')

const driver = neo4j.driver(config.neo4j.url, neo4j.auth.basic(config.neo4j.username, config.neo4j.password));
(async () => {
    try {
        await driver.verifyConnectivity()
        console.log('Driver created')
    } catch (error) {
        console.log(`connectivity verification failed. ${error}`)
    }
})();

module.exports = {
    read: (cypher, params = {}, database = config.neo4j.database) => {
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
    txRead: async (cypher, params = {}, database = config.neo4j.database) => {
        const session = driver.session({
            defaultAccessMode: neo4j.session.READ,
            database
        });
        try {
        return await session.readTransaction(tx => 
            tx.run(cypher, params)
        )
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },
    write: (cypher, params = {}, database = config.neo4j.database) => {
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
    txWrite: async (cypher, params = {}, database = config.neo4j.database) => {
        const session = driver.session({
            defaultAccessMode: neo4j.session.WRITE,
            database
        });
        try {
        return await session.writeTransaction(tx => 
            tx.run(cypher, params)
        )
        } catch (error) {
            throw error;
        } finally {
            await session.close();
        }
    },
}