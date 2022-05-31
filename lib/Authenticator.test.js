const pool = require("../db/index");
const Authenticator = require("./Authenticator");
var authenticator = Authenticator.defaultAuthenticator;

describe("Tests for Authenticator Class ", () => {
  describe("JWT Utility Function Testing", () => {
    test("Test if token generated and verified with proper payload", async () => {
      let payload = {
        administrator_id: "1",
        username: "admin1",
      };
      let expiration = { expiresIn: "1w" };
      let token = await Authenticator.createToken(payload);
      expect(token).toEqual(expect.anything());
      let decodedToken = await Authenticator.verifyAndReturnPayload(token);
      expect(decodedToken.administrator_id).toBe("1");
    });

    test("Expired JWT's will throw error on verfication", async () => {
      let payload = {
        administrator_id: "1",
        exp: Math.floor(Date.now() / 1000),
      };
      let token = await Authenticator.createToken(payload);
      try {
        await Authenticator.verifyAndReturnPayload(token);
      } catch (err) {
        expect(err).not.toBe(expect.anything());
      }
    });
  });
});

    
    
    


