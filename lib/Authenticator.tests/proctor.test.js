var Mock = require("./__mocks__");
var authenticator = require("../Authenticator").defaultAuthenticator;
var proctor = Mock.proctor;
var administrator = Mock.administrator;

/* Registeration */
describe("Testing Proctor Registeration", () => {
  beforeEach(async () => {
    await pool.query(adminQueries.truncateAdministrators);
    await pool.query(proctorQueries.truncateProctors);
  });
  test("Recieve token after Registering proctor by an administrator", async () => {
    let token = await authenticator.registerAdministrator(administrator);
    proctor.administrator = administrator.administrator_id;
    let proctorToken = await authenticator.registerProctor(proctor, token);
    expect(proctorToken).not.toBeNull();
    let decodedToken = await Authenticator.verifyAndReturnPayload(proctorToken);
    expect(decodedToken.username).toBe("proctor");
  });

  test("Recieve token after regoserting proctor of same username with different administrator", async () => {
    let token1 = await authenticator.registerAdministrator(adminitrator);
    administrator.username = "administrator2";
    let token2 = await authenticator.registerAdministrator(adminitrator);
    expect(await authenticator.registerProctor(proctor, token1)).not.toBeNull();
    expect(await authenticator.registerProctor(proctor, token2)).not.toBeNull();
  });

  test("Recive Error if username for Proctor is already resgistered, async style", async () => {
    expect.assertions(1);
    let token = await authenticator.registerAdministrator(administrator);
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
    try {
      await authenticator.registerProctor(proctor, token);
    } catch (err) {
      expect(err).not.toBe(expect.anything());
    }
  });
  afterAll(async () => {
    await pool.query(adminQueries.truncateAdministrators);
    await pool.query(proctorQueries.truncateProctors);
    await pool.query(examineeQueries.truncateExaminees);
  });
});

/* Authentication */
describe("Testing Proctor Authentication", () => {
  test("Proctor can login with username, password", async () => {
    let token = await authenticator.loginProctor(proctor);
    expect(token).not.toBe(expect.anything());
  });

  test("Throw error with unknown username for proctor", async () => {
    await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
      Error("Username not Found")
    );
  });

  test("Throw error with invalid password for proctor", async () => {
    proctor.password = "invalid_password";
    await expect(authenticator.loginProctor(proctor)).rejects.toThrow(
      Error("Invalid Credentials")
    );
  });

  test("After login token will contain administrator id", async () => {
    let token = await authenticator.loginProctor(proctor);
    let decodedToken = await Authenticator.verifyAndReturnPayload(token);
    expect(decodedToken.administrator).toBeTruthy();
  });
});

/* Unregisteration */
describe("Unregister Proctor", () => {
  var token;
  beforeEach(async () => {
    token = await authenticator.registerAdministrator(administrator);
    let decoded = await Authenticator.verifyAndReturnPayload(token);
    proctor.administrator = decoded.administrator_id;
    await authenticator.registerProctor(proctor, token);
  });

  test("An administrator unregiters an proctor", async () => {
    let returned = await authenticator.unregisterProctor(token, proctor);
    expect(returned).not.toBeNull();
    expect(returned).toBeTruthy();
    expect(returned).toBe(proctor.username);
  });
});
