const { Pool } = require('pg')
const config = require('../config');
const pool = new Pool({
    connectionString: config.connectionString,
});
/* Create rps schema */
pool.query(gen)
/* Create Our Database */
pool.query("Create table rps.administrators (administrator_id bigserial primary key, \
   username varchar(50) not null unique, password varchar(50) not null)");


module.exports = pool;
