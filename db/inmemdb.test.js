const { expressjwt } = require('express-jwt');
const { pool }  = require('./inmemdb');
describe("Test In Memory Database Initialization/Deinitialization", () => {
    beforeAll(() => {
        pool.query("Create table rps.administrators (administrator_id bigserial primary key, username varchar(50) not null unique, password varchar(50) not null)");
        pool.query("Insert into rps.administrators (username, password) values ('admin12', 'admin1234!!')");   
        pool.query("Insert into rps.administrators (username, password) values ('admin1', 'admin1234!!')");        
    });
    test('Verify if rps.administrator table is created and populated', async () => {
        let res = await pool.query('Select username, password from rps.administrators');
        expect(res).not.toBeNull();
        expect(res).not.toBeUndefined();
    });

    test('Verify if row for username admin1 exists in rps.administrators', async () => {
        let res = await pool.query('Select username, password from rps.administrators where username = $1::text', ["admin1"]);
        expect(res).not.toBeNull();
        expect(res).not.toBeUndefined();
        expect(res.rows[0].username).toBe('admin1')
        expect(res.rows[0].password).toBe('admin1234!!');
    });

    afterAll(()=> {
        pool.query("drop table rps.administrators");
    });
});


test('Verify if rps.administrators table is dropped properly', async () => {
        try{
            await pool.query('Select username, password from rps.administrators');
        } catch(err){
            expect(err).not.toBeNull();
        }
});