var Mock = require("./__mocks__");
var Authenticator = require("../Authenticator");
const Mocks = require("./__mocks__");
var authenticator = Authenticator.defaultAuthenticator;
var proctor = Mock.proctor;
var administrator = Mock.administrator;

var adminToken, // Used in registering a proctor
  proctorToken, // Used in authenticating,  a proctor
  administrator_id; // Used in registering a proctor

/* Registeration */
describe("Testing Proctor Registeration", () => {
  beforeAll(async () => {
    /* We need an administrator to be registered and logged in before registering a proctor */

    try {
          /* Registering always returns a token so no need to login again */
    adminToken = await authenticator.registerAdministrator(administrator);
    } catch(err) {
      if(err.message === "Username already exists"){
        adminToken = await authenticator.loginAdministrator(administrator);
      }
    }
    let decoded = await Authenticator.verifyAndReturnPayload(adminToken);
    administrator_id = decoded.administrator_id; 
  });
  test("Recieve proctor object after Registering proctor by an administrator", async () => {
    proctor = await authenticator.registerProctor(proctor, adminToken);
    expect(
      proctor.administrator
    ).toBe(administrator_id);
  });

  test("Recieve token after regiserting proctor of same username with different administrator", async () => {
    adminToken = await authenticator.registerAdministrator(adminitrator);
    expect(
      await authenticator.registerProctor(proctor, adminToken)
    ).not.toBeNull();

    administrator.username = "administrator2";
    adminToken = await authenticator.registerAdministrator(adminitrator);
    expect(
      await authenticator.registerProctor(proctor, adminToken)
    ).not.toBeNull();

    Mocks.resetAdministrator();
  });

  test("Recive Error if username for Proctor is already resgistered", async () => {
    expect.assertions(1);
    adminToken = await authenticator.registerAdministrator(administrator);
    prcoctorToken = await authenticator.registerProctor(proctor, adminToken);
    try {
      await authenticator.registerProctor(proctor, adminToken);
    } catch (err) {
      expect(err).toMatchObject(Error("Username already exists"));
    }
  });
});

describe("Testing Authentication and Unregisteration", () => {
  beforeAll(async () => {
    // Register a fake Proctor
    adminToken = await authenticator.registerAdministrator(administrator);
    administrator_id = await Authenticator.verifyAndReturnPayload(token)
      .administrator_id;
    proctor.administrator = administrator_id;
    proctorToken = await authenticator.registerProctor(proctor, adminToken);
  });

  /* Authentication */
  describe("Testing Proctor Authentication", () => {
    test("Proctor can login with username, password", async () => {
      let token = await authenticator.loginProctor(proctor);
      expect(token).not.toBe(proctorToken);
    });

    test("Throw error with unknown username for proctor", async () => {
      proctor.username = "unknwon_proctor";
      await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
        Error("Username not Found")
      );

      Mock.resetProctor();
    });

    test("Throw error with invalid password for proctor", async () => {
      proctor.password = "invalid_password";
      await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
        Error("Invalid Credentials")
      );

      Mock.resetProctor();
    });

    test("After login token will contain administrator id", async () => {
      proctorToken = await authenticator.loginProctor(proctor);
      expect(
        await Authenticator.verifyAndReturnPayload(proctorToken).administrator
      ).toBe(administrator_id);
    });
  });

  /* Unregisteration */
  describe("Unregister Proctor", () => {
    test("An administrator unregiters an proctor", async () => {
      expect(await authenticator.unregisterProctor(adminToken, proctor)).toBe(
        proctor.username
      );
    });
  });
});
