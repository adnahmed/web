const pool = require('../db/inmemdb');
const Authenticator = require('./Authenticator');
const Administrator = require('../models/administrator');
var authenticator = new Authenticator(pool);
describe("Tests for Authenticator Class ", () => {
    describe("Testing Registeration", () => {
        describe("Testing Administrator Registeration", () => {
            beforeAll(() => {

            });
            test ('Recieve token after registering new Administrator', async () => {
                let administrator = new Administrator("admin1", "admin123!");
                let token = await adminAuthenticator.registerAdministrator(administrator);
                expect(token).not.toBeNull();
            }); 
    
            test ('Recieve Error if username for Administrator already exists', ()=> {
                let administrator = new Administrator("admin1", "admin123!");
                expect(() => authenticator.registerAdministrator(administrator)).toThrow();
            });
        });
    });
});