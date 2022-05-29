const pool = require('../db/inmemdb');
const Authenticator = require('./Authenticator');
const Administrator = require('../models/administrator');
const adminQueries = require('../queries/admin');
var authenticator = new Authenticator(pool);

describe("Tests for Authenticator Class ", () => {
    describe("Testing Registeration", () => {
        describe("Testing Administrator Registeration", () => {
            beforeEach(()=>{
                pool.query(adminQueries.truncateAdministrators);
            });
            test ('Recieve token after registering new Administrator', async () => {
                let administrator = new Administrator("admin1", "admin123!");
                let token = await authenticator.registerAdministrator(administrator);
                expect(token).not.toBeNull();
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