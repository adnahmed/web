const { expressjwt } = require('express-jwt');
const adminQueries = require('../queries/admin');

const pool   = require('./inmemdb');
describe("Test In Memory Database Initialization/Deinitialization", () => {
    describe("Test if administrator was populated correctly", () => {
        beforeAll(() => {
            pool.query(adminQueries.insertAdministrator, ['admin1', 'admin1234!!']);   
            pool.query(adminQueries.insertAdministrator, ["adminqw1", "admin123@!"]);       
        });
        test('Verify if administrator table is created and populated', async () => {
            let res = await pool.query(adminQueries.selectUsernamePassword);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
        });
    
        test('Verify if row for username admin1 exists in administrators', async () => {
            let res = await pool.query(adminQueries.selectUsernamePasswordWhereUsername, ["admin1"]);
            expect(res).not.toBeNull();
            expect(res).not.toBeUndefined();
            expect(res.rows[0].username).toBe('admin1')
            expect(res.rows[0].password).toBe('admin1234!!');
        });
    
        afterAll(()=> {
            pool.query(adminQueries.truncateAdministrators);
        });
    })
    test('Verify if rps.administrators table is dropped properly', async () => {
        try{
            await pool.query(adminQueries.selectUsernamePassword);
        } catch(err){
            expect(err).not.toBeNull();
    }
});
});


