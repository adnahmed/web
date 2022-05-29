const {newDb} = require('pg-mem');
const { Pool } = require('pg')
const genericQueries = require('../queries/generic');
const adminQueries = require('../queries/admin');
const db = newDb();
/* Creae rps schema */
let rps = db.createSchema("rps");
/* Create in memory client */
const {Client} = db.adapters.createPg();
/* pg-mem pool uses in memory client */
const pool = new Pool({Client: Client});

/* Set search path */
pool.query(genericQueries.setSearchPathRPS);

pool.query(adminQueries.createAdministrator);
module.exports = pool;
