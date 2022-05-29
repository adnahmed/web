const {newDb} = require('pg-mem');
const { Pool } = require('pg')

const db = newDb();
/* Creae rps schema */
let rps = db.createSchema("rps");
/* Create in memory client */
const {Client} = db.adapters.createPg();
/* pg-mem pool uses in memory client */
const pool = new Pool({Client: Client});

module.exports = { pool };
