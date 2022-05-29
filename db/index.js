const { Pool } = require('pg')
const genericQueries = require('../queries/generic');
const adminQueries = require('../queries/admin');
const config = require('../config');
const pool = new Pool({
    connectionString: config.connectionString,
});

module.exports = pool;