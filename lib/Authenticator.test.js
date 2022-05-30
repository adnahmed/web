const pool = require("../db/index");
const Authenticator = require("./Authenticator");
const Administrator = require("../models/administrator");
const adminQueries = require("../queries/admin");
const examineeQueries = require("../queries/examinee");
const bcrypt = require("bcrypt");
var authenticator = new Authenticator(pool);

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
  describe("Testing Registeration", () => {
    /* To test for registeration, database must be created before */
    beforeAll(async () => {
      await pool.query(adminQueries.createAdministrator);
    });

    describe("Testing Administrator Registeration", () => {
      /* multiple tests might use same value to register therefore truncate before */
      beforeEach(async () => {
        await pool.query(adminQueries.truncateAdministrators);
      });

      test("Registered Administrators don't have password stored in plain text", async () => {
        let administrator = new Administrator("admin1", "admin123");

        let token = await authenticator.registerAdministrator(administrator);

        let decoded = await Authenticator.verifyAndReturnPayload(token);
        let res = await pool.query(
          adminQueries.select.passwordWhereAdministratorId,
          [decoded.administrator_id]
        );

        let hashedPassword = res.rows[0].password;

        bcrypt.compare(administrator.password, hashedPassword, (err, res) => {
          expect(err).not.toBe(expect.anything());
          expect(res).toBeTruthy();
        });
      });

      test("Recieve token after registering new Administrator", async () => {
        let administrator = new Administrator("admin1", "admin123!");
        let token = await authenticator.registerAdministrator(administrator);
        expect(token).not.toBeNull();
        let decodedToken = await Authenticator.verifyAndReturnPayload(token);
        expect(decodedToken.username).toBe("admin1");
      });

      test("Recieve Error if username for Administrator already exists", () => {
        expect.assertions(1);
        let administrator = new Administrator("admin1", "admin123!");
        return authenticator.registerAdministrator(administrator).then(() => {
          return authenticator
            .registerAdministrator(administrator)
            .catch((err) => {
              expect(err).not.toBeNull();
            });
        });
      });

      test("Recive Error if username for Administrator is already resgistered, async style", async () => {
        expect.assertions(1);
        let administrator = new Administrator("admin1", "admin123!");
        try {
          await authenticator.registerAdministrator(administrator);
          await authenticator.registerAdministrator(administrator);
        } catch (err) {
          expect(err).not.toBeNull();
        }
      });
      /* Final Cleanup */
      afterAll(async () => {
        await pool.query(adminQueries.truncateAdministrators);
      });
    });
    describe("Testing Examinee Registeration", () => {
      /* We'll inset new examinees in tests, so have no before */
      beforeAll(async () => {
        await pool.query(examineeQueries.createExaminee).catch(err => {
            throw err;
        }) ;
      });
      beforeEach(async () => {
        await pool.query(adminQueries.truncateAdministrators);
      });
      test("Recieve token after Registering Examinee by an administrator", async () => {
        
        await pool.query(examineeQueries.truncateExaminees);
        let administrator = new Administrator("admin541", "admin123!");

        let token = await authenticator.registerAdministrator(administrator);
        let examinee = {
          username: "examinee1",
          password: "examinee123!",
          first_name: "examinee",
          last_name: "examinee",
        };
        let examineeToken = await authenticator.registerExaminee(
          examinee,
          token
        );
        expect(examineeToken).not.toBeNull();
        let decodedToken = await Authenticator.verifyAndReturnPayload(examineeToken);
        expect(decodedToken.username).toBe("examinee1");
      });

      test("Recive Error if username for Examinee is already resgistered, async style", async () => {
        expect.assertions(1);
        let administrator = new Administrator("admin541", "admin123!");

        let token = await authenticator.registerAdministrator(administrator);
        let examinee = {
          username: "examinee1",
          password: "examinee123!",
          first_name: "examinee",
          last_name: "examinee",
        };
        let examineeToken = await authenticator.registerExaminee(
          examinee,
          token
        );
        try {
          
         await authenticator.registerExaminee(
                examinee,
                token
              );
        } catch (err) {
          expect(err).toMatchObject(Error("Username already exists"));
        }
      });

      test("Expired token administrators will recieve error", async () => {
        expect.assertions(1);
        let payload = {
            administrator_id: "1",
            exp: Math.floor(Date.now() / 1000),
          };
          let examinee = {
            username: "examinee1",
            password: "examinee123!",
            first_name: "examinee",
            last_name: "examinee",
          };
          let token = await Authenticator.createToken(payload);
          try {
            await authenticator.registerExaminee(examinee, token);
          } catch (err) {
            expect(err).not.toBe(expect.anything());
          }
      });
      afterAll(async () => {
        await pool.query(adminQueries.truncateAdministrators);
        await pool.query(examineeQueries.truncateExaminees);
      });
    });
  });
});
