const neo4j = require('../neo4j');
const cypher = require('./index');
const fs = require('fs');
const path = require('path');
(async ()=> {
    /* Create Constraints on Startup */
    await neo4j.write(cypher('user-username-unique-constraint'));
    /*********/

    /* Create Index on Startup */
    fs.readdir(__dirname,null ,async (err, files) => {
        for (file of files) {
            let name = file;
            if (/index[\w-]+.cypher/.test(file))
                await neo4j.write(cypher(path.basename(file, '.cypher')));    
        }
    })
    /*********/
    console.log('Startup setup complete.');
})();

