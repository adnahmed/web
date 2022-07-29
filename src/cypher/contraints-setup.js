const neo4j = require('../neo4j');
const cypher = require('./index');

/* Create Constraints on Startup */
neo4j.write(cypher('user-username-unique-constraint'));
/*********/

console.log('Constraints setup complete.');

