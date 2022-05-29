const { Pool } = require('pg')
const genericQueries = require('../queries/generic');
const adminQueries = require('../queries/admin');
const config = require('../config');
const pool = new Pool({
    connectionString: config.connectionString,
});
pool.query(genericQueries.createRPSSchema);
pool.query(genericQueries.setSearchPathRPS);
pool.query(adminQueries.createAdministrator);
module.exports = pool;