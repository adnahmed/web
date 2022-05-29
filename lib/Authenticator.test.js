const pool = require('../db/index');
const Authenticator = require('./Authenticator');
const Administrator = require('../models/administrator');
const adminQueries = require('../queries/admin');
const bcrypt = require('bcrypt');
var authenticator = new Authenticator(pool);

describe("Tests for Authenticator Class ", () => {
    describe("JWT Utility Function Testing", () => {
        test("Test if token generated and verified with proper payload", async () => {
            let payload = {
                administrator_id: "1",
                username: "admin1",
            }
            let expiration = { expiresIn: '1w'}
            let token = await Authenticator.createToken(payload);
            expect(token).toEqual(expect.anything());
            let decodedToken = await Authenticator.verifyAndReturnPayload(token);
            expect(decodedToken.administrator_id).toBe("1");
        });

        test("Expired JWT's will throw error on verfication", async () => {
            let payload = {
                administrator_id : "1",
                exp: Math.floor(Date.now()/1000)
            }
            let token = await Authenticator.createToken(payload);
            try {
                await Authenticator.verifyAndReturnPayload(token);
            } catch (err){
                expect(err).not.toBe(expect.anything());
            }
        })
    });
    describe("Testing Registeration", () => {
        describe("Testing Administrator Registeration", () => {
            beforeEach(()=>{
                pool.query(adminQueries.truncateAdministrators);
            });

            test("Registered Users don't have password stored in plain text", async () => {
                let administrator = new Administrator("admin1", "admin123");
                
                let token = await authenticator.registerAdministrator(administrator);
                
                let decoded = await Authenticator.verifyAndReturnPayload(token);
                let res = await pool.query(adminQueries.selectPasswordWhereAdministratorId,[decoded.administrator_id]);
                let hashedPassword = res.rows[0].password;
                
                bcrypt.compare(administrator.password, hashedPassword, (err, res)=> {
                    expect(err).not.toBe(expect.anything());
                    expect(res).toBeTruthy();
                })
            });
            
            test ('Recieve token after registering new Administrator', async () => {
                let administrator = new Administrator("admin1", "admin123!");
                let token = await authenticator.registerAdministrator(administrator);
                expect(token).not.toBeNull();
                let decodedToken = await Authenticator.verifyAndReturnPayload(token);
                expect(decodedToken.username).toBe("admin1");
            }); 
        
            test ('Recieve Error if username for Administrator already exists', ()=> {
                expect.assertions(1);
                let administrator = new Administrator("admin1", "admin123!");
                return authenticator.registerAdministrator(administrator).then(()=> {
                    return authenticator.registerAdministrator(administrator).catch(err => {
                        expect(err).not.toBeNull();
                    });
                });
            });

            test('Recive Error if username for Administrator is already resgistered, async style', async () => {
                expect.assertions(1);
                let administrator = new Administrator("admin1", "admin123!");
                try {
                    await authenticator.registerAdministrator(administrator);
                    await authenticator.registerAdministrator(administrator);
                } catch(err) {
                    expect(err).not.toBeNull();
                }
            });
        });
    });
});