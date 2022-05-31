const { expressjwt } = require('express-jwt');
const  pool   = require('./index');
const adminQueries = require('../queries/admin');
const { protocols } = require('superagent');

describe("Test Database Initialization/Deinitialization", () => {
/* truncate because we do insertions in all tests */
    beforeEach(async () => {
    await pool.query(adminQueries.truncateAdministrators);
    });
    /* Database must exist before testing insertion/deletion. */
    describe("Test if administrator was populated correctly", () => {
        
        afterEach(async () => {
            await pool.query(adminQueries.truncateAdministrators);
        })
        test('Verify if administrator table is created and populated', async () => {
            await pool.query(adminQueries.insert.usernamePasswordName, ["adminqw1", "admin123@!", "admin", "admin"]);
            let res = await pool.query(adminQueries.select.usernamePassword);
            expect(res).not.toBeNull();
            expect(res.rowCount).toBe(1);
        });
    
        test('Verify if row for username admin1 exists in administrators', async () => {
            await pool.query(adminQueries.insert.usernamePasswordName, ["admin1", "admin123@!", "admin", "admin"]);
            let res = await pool.query(adminQueries.select.usernamePasswordWhereUsername, ["admin1"]);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
            expect(res.rows[0].username).toBe('admin1')
            expect(res.rows[0].password).toBe('admin123@!');
        });
    });
describe("Test truncation of table", () => {
    beforeAll(async () => {
        await pool.query(adminQueries.truncateAdministrators);
    });
    test('Verify if administrators table is truncated', async () => {
        let res = await pool.query(adminQueries.select.usernamePassword);
        expect(res.rowCount).toBe(0);
    });
});
    
});


