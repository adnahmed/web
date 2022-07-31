const neo4j = require('../neo4j');
const cypher = require('./index');

(async ()=> {
    /* Create Constraints on Startup */
    await neo4j.write(cypher('user-username-unique-constraint'));
    /*********/

    /* Create Index on Startup */
    await neo4j.write(cypher('model-indexing-queries'));
    /*********/
    console.log('Startup setup complete.');
})();

