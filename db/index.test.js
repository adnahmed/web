const { expressjwt } = require('express-jwt');
const  pool   = require('./index');
const adminQueries = require('../queries/admin');
const { protocols } = require('superagent');

describe("Test Database Initialization/Deinitialization", () => {
/* truncate because we do insertions in all tests */
    beforeEach(async () => {
    await pool.query(adminQueries.truncateAdministrators);
})
    /* Database must exist before testing insertion/deletion. */
    describe("Test if administrator was populated correctly", () => {
        test('Verify if administrator table is created and populated', async () => {
            await pool.query(adminQueries.insert.usernamePassword, ["adminqw1", "admin123@!"]);
            let res = await pool.query(adminQueries.select.usernamePassword);
            expect(res).not.toBeNull();
            expect(res.rows.length).toBe(1);
        });
    
        test('Verify if row for username admin1 exists in administrators', async () => {
            await pool.query(adminQueries.insert.usernamePassword, ["admin1", "admin123@!"]);
            let res = await pool.query(adminQueries.select.usernamePasswordWhereUsername, ["admin1"]);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
            expect(res.rows[0].username).toBe('admin1')
            expect(res.rows[0].password).toBe('admin123@!');
        });
        /* Each Test inserts similar objects, so we truncate */
        afterEach(async () => {
            await pool.query(adminQueries.truncateAdministrators);
        })
    })
    test('Verify if administrators table is truncated', async () => {
        await pool.query(adminQueries.truncateAdministrators);
        let res = await pool.query(adminQueries.select.usernamePassword);
        expect(res.rows.length).toBe(0);
    });
});

