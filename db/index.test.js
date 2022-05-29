const { expressjwt } = require('express-jwt');
const  pool   = require('./index');
const adminQueries = require('../queries/admin');

describe("Test Database Initialization/Deinitialization", () => {
    describe("Test if administrator was populated correctly", () => {
        beforeAll(() => {
            pool.query(adminQueries.insert.usernamePassword, ['admin1', 'admin1234!!']);   
            pool.query(adminQueries.insert.usernamePassword, ["adminqw1", "admin123@!"]);       
        });
        test('Verify if administrator table is created and populated', async () => {
            let res = await pool.query(adminQueries.select.usernamePassword);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
        });
    
        test('Verify if row for username admin1 exists in administrators', async () => {
            let res = await pool.query(adminQueries.select.usernamePasswordWhereUsername, ["admin1"]);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
            expect(res.rows[0].username).toBe('admin1')
            expect(res.rows[0].password).toBe('admin1234!!');
        });
    
        afterAll(()=> {
            pool.query(adminQueries.truncateAdministrators);
        });
    })
    test('Verify if administrators table is dropped properly', async () => {
        try{
            await pool.query(adminQueries.select.usernamePassword);
        } catch(err){
            expect(err).not.toBeNull();
    }
});
});


