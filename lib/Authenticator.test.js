const pool = require("../db/index");
const Authenticator = require("./Authenticator");
const Administrator = require("../models/administrator");
const Examinee = require("../models/examinee");
const Proctor = require("../models/proctor");
const adminQueries = require("../queries/admin");
const examineeQueries = require("../queries/examinee");
const proctorQueries = require("../queries/proctor");
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
      await pool.query(examineeQueries.createExaminee);
      await pool.query(proctorQueries.createProctor);
    });

    describe("Testing Administrator Registeration", () => {
      /* multiple tests might use same value to register therefore truncate before */
      beforeEach(async () => {
        await pool.query(adminQueries.truncateAdministrators);
      });

      test("Registered Administrators don't have password stored in plain text", async () => {
        await pool.query(adminQueries.truncateAdministrators);

        let administrator = new Administrator(
          "admin1",
          "admin123",
          "admin",
          "admin"
        );

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
        let administrator = new Administrator(
          "admin1",
          "admin123!",
          "admin",
          "admin"
        );
        let token = await authenticator.registerAdministrator(administrator);
        expect(token).not.toBeNull();
        let decodedToken = await Authenticator.verifyAndReturnPayload(token);
        expect(decodedToken.username).toBe("admin1");
      });

      test("Recieve Error if username for Administrator already exists", () => {
        expect.assertions(1);
        let administrator = new Administrator(
          "admin1",
          "admin123!",
          "admin",
          "admin"
        );
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
        let administrator = new Administrator(
          "admin1",
          "admin123!",
          "admin",
          "admin"
        );
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
      beforeEach(async () => {
        await pool.query(adminQueries.truncateAdministrators);
      });
      test("Recieve token after Registering Examinee by an administrator", async () => {
        await pool.query(examineeQueries.truncateExaminees);
        let administrator = new Administrator(
          "admin541",
          "admin123!",
          "admin",
          "admin"
        );

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
        let decodedToken = await Authenticator.verifyAndReturnPayload(
          examineeToken
        );
        expect(decodedToken.username).toBe("examinee1");
      });
      
      test("Recieve token after regoserting examinee of same username with different administrator", async () => {
        let examinee = {
          username: "examinee1",
          password: "examinee123!",
          first_name: "examinee",
          last_name: "examinee",
        };
        let adminitrator1 = new Administrator("admin1", "admin123!","admin", "admin");
        let token1 = await authenticator.registerAdministrator(adminitrator1);
        let adminitrator2 = new Administrator("admin2", "admin123!","admin", "admin");
        let token2 = await authenticator.registerAdministrator(adminitrator2);
        expect(await authenticator.registerExaminee(examinee, token1)).not.toBeNull();
        expect(await authenticator.registerExaminee(examinee, token2)).not.toBeNull();
      })

      test("Recive Error if username for Examinee is already resgistered, async style", async () => {
        expect.assertions(1);
        let administrator = new Administrator(
          "admin541",
          "admin123!",
          "admin",
          "admin"
        );

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
          await authenticator.registerExaminee(examinee, token);
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
    describe("Testing Proctor Registeration", () => {
      beforeEach(async () => {
        await pool.query(adminQueries.truncateAdministrators);
        await pool.query(proctorQueries.truncateProctors);
      });
      test("Recieve token after Registering proctor by an administrator", async () => {
        let administrator = new Administrator(
          "admin541",
          "admin123!",
          "admin",
          "admin"
        );
        let token = await authenticator.registerAdministrator(administrator);
        let proctor = new Proctor(
          administrator.administrator_id,
          "proctor1",
          "proctor123!",
          "proctor1",
          "proctor2"
        );
        let proctorToken = await authenticator.registerProctor(proctor, token);
        expect(proctorToken).not.toBeNull();
        let decodedToken = await Authenticator.verifyAndReturnPayload(
          proctorToken
        );
        expect(decodedToken.username).toBe("proctor1");
      });

      test("Recive Error if username for Proctor is already resgistered, async style", async () => {
        expect.assertions(1);
        let administrator = new Administrator(
          "admin541",
          "admin123!",
          "admin",
          "admin"
        );

        let token = await authenticator.registerAdministrator(administrator);
        let proctor = new Proctor(
          null,
          "proctor1",
          "proctor123!",
          "proctor1",
          "proctor2"
        );

        let prcoctorToken = await authenticator.registerProctor(proctor, token);
        try {
          await authenticator.registerProctor(proctor, token);
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

        let token = await Authenticator.createToken(payload);
        let proctor = new Proctor(
          null,
          "proctor1",
          "proctor123!",
          "proctor1",
          "proctor2",
        );

        try {
          await authenticator.registerProctor(proctor, token);
        } catch (err) {
          expect(err).not.toBe(expect.anything());
        }
      });
      afterAll(async () => {
        await pool.query(adminQueries.truncateAdministrators);
        await pool.query(proctorQueries.truncateProctors);
      });
    });
  });
  describe("Testing Authentication", () => {
    /* Register two examineeds and administrators each */
    beforeAll(async () => {
      let administrator = new Administrator(
        "admin1",
        "admin123!",
        "admin",
        "admin"
      );
      let token = await authenticator.registerAdministrator(administrator);
      let decodedToken = await Authenticator.verifyAndReturnPayload(token);
      var examinee1 = new Examinee(
        decodedToken.administrator_id,
        "examinee1",
        "examinee123!",
        "examinee",
        "examinee"
      );
      var examinee2 = new Examinee(
        decodedToken.administrator_id,
        "examinee2",
        "examinee123!",
        "examinee",
        "examinee"
      );
      var proctor1 = new Proctor(
        decodedToken.administrator_id,
        "proctor1",
        "proctor123!",
        "proctor",
        "proctor"
      );
      var proctor2 = new Proctor(
        decodedToken.administrator_id,
        "proctor2",
        "proctor123!",
        "proctor",
        "proctor"
      );
      await authenticator.registerExaminee(examinee1, token);
      await authenticator.registerExaminee(examinee2, token);
      await authenticator.registerProctor(proctor1, token);
      await authenticator.registerProctor(proctor2, token);
    });
    describe("Testing Examinee Authentication", () => {
      test("Examinee can login with username, password", async () => {
        let examinee = new Examinee(null, "examinee1", "examinee123!");
        let token = await authenticator.loginExaminee(examinee);
        expect(token).not.toBe(expect.anything());
      });

      test("Throw error with unknown username for examinee", async () => {
        let examinee = new Examinee(null, "unknownexaminee", "examinee123!!");
        await expect(authenticator.loginExaminee(examinee)).rejects.toThrow(
          Error("Username not Found")
        );
      });

      test("Throw error with invalid password for examinee", async () => {
        let examinee = new Examinee(null, "examinee1", "examinee13!!");
        await expect(authenticator.loginExaminee(examinee)).rejects.toThrow(
          Error("Invalid Credentials")
        );
      });
      test("After login token will contain administrator id", async () => {
        let examinee = new Examinee(null, "examinee1", "examinee123!");
        let token = await authenticator.loginExaminee(examinee);
        let decodedToken = await Authenticator.verifyAndReturnPayload(token);
        expect(decodedToken.administrator).toBeTruthy();
      });
    });

    describe("Testing Administrator Authentication", () => {
      test("Administrator can login with username, password", async () => {
        let administrator = new Administrator("admin1", "admin123!");
        let token = await authenticator.loginAdministrator(administrator);
        expect(token).not.toBe(expect.anything());
      });

      test("Throw error with unknown username for administrator", async () => {
        let administrator = new Examinee(null, "unknownadmin", "admin123!");
        await expect(
          authenticator.loginAdministrator(administrator)
        ).rejects.toThrow(Error("Username not Found"));
      });

      test("Throw error with invalid password for administrator", async () => {
        let administrator = new Examinee(null, "admin1", "admin12!");
        await expect(
          authenticator.loginAdministrator(administrator)
        ).rejects.toThrow(Error("Invalid Credentials"));
      });
    });
    describe("Testing Proctor Authentication", () => {
      test("Proctor can login with username, password", async () => {
        let proctor = new Proctor(null, "proctor1", "proctor123!");
        let token = await authenticator.loginProctor(proctor);
        expect(token).not.toBe(expect.anything());
      });

      test("Throw error with unknown username for proctor", async () => {
        let proctor = new Proctor(null, "unknownproctor", "proctor123!!");
        await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
          Error("Username not Found")
        );
      });

      test("Throw error with invalid password for proctor", async () => {
        let proctor = new Proctor(null, "proctor1", "proctor13!!");
        await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
          Error("Invalid Credentials")
        );
      });
      test("After login token will contain administrator id", async () => {
        let proctor = new Examinee(null, "proctor1", "proctor123!");
        let token = await authenticator.loginProctor(proctor);
        let decodedToken = await Authenticator.verifyAndReturnPayload(token);
        expect(decodedToken.administrator).toBeTruthy();
      });
    });
    afterAll(async () => {
      await pool.query(examineeQueries.truncateExaminees);
      await pool.query(adminQueries.truncateAdministrators);
    });
  });
});
