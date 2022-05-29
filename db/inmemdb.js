const {newDb} = require('pg-mem');
const { Pool } = require('pg')

const db = newDb();
/* Creae rps schema */
let rps = db.createSchema("rps");
/* Create in memory client */
const {Client} = db.adapters.createPg();
/* pg-mem pool uses in memory client */
const pool = new Pool({Client: Client});

/* Create Our Database */

pool.query("Create table rps.administrators (administrator_id bigserial primary key, \
   username varchar(50) not null unique, password varchar(50) not null)");


module.exports = pool;
