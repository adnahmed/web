var Mock = require("./__mocks__");
var authenticator = require("../Authenticator").defaultAuthenticator;
var administrator = Mock.administrator;
var examinee = Mock.examinee;

/* Registeration */
describe("Testing Examinee Registeration", () => {
  beforeEach(async () => {
    let token = authenticator.loginAdministrator(administrator);
    authenticator.unregisterExaminee(token, examinee);
    authenticator.unregisterAdministrator(administrator);
  });
  test("Recieve token after Registering Examinee by an administrator", async () => {
    let token = await authenticator.registerAdministrator(administrator);
    let examineeToken = await authenticator.registerExaminee(examinee, token);
    expect(examineeToken).not.toBeNull();
    let decodedToken = await Authenticator.verifyAndReturnPayload(
      examineeToken
    );
    expect(decodedToken.username).toBe("examinee");
  });

  test("Recieve token after regoserting examinee of same username with different administrator", async () => {
    let token1 = await authenticator.registerAdministrator(adminitrator);
    administrator.username = "administrator2";
    let token2 = await authenticator.registerAdministrator(adminitrator);
    expect(
      await authenticator.registerExaminee(examinee, token1)
    ).not.toBeNull();
    expect(
      await authenticator.registerExaminee(examinee, token2)
    ).not.toBeNull();
  });

  test("Recive Error if username for Examinee is already resgistered", async () => {
    expect.assertions(1);
    let token = await authenticator.registerAdministrator(administrator);
    await authenticator.registerExaminee(examinee, token);
    try {
      await authenticator.registerExaminee(examinee, token);
    } catch (err) {
      expect(err).toMatchObject(Error("Username already exists"));
    }
  });

  afterAll(async () => {
    let token = authenticator.loginAdministrator(administrator);
    authenticator.unregisterExaminee(token, examinee);
    authenticator.unregisterAdministrator(token);
  });
});

/* Authentication */
describe("Testing Examinee Authentication", () => {
  test("Examinee can login with username, password", async () => {
    let token = await authenticator.loginExaminee(examinee);
    expect(token).not.toBe(expect.anything());
  });

  test("Throw error with unknown username for examinee", async () => {
    examinee.username = "unknown_examinee";
    await expect(authenticator.loginExaminee(examinee)).rejects.toThrow(
      Error("Username not Found")
    );
  });

  test("Throw error with invalid password for examinee", async () => {
    examinee.password = "invalid_password";
    await expect(authenticator.loginExaminee(examinee)).rejects.toThrow(
      Error("Invalid Credentials")
    );
  });

  test("After login token will contain administrator id", async () => {
    let token = await authenticator.loginExaminee(examinee);
    let decodedToken = await Authenticator.verifyAndReturnPayload(token);
    expect(decodedToken.administrator).toBeTruthy();
  });
});

/* Unregisteration */
describe("Unregister Examinee", () => {
  var token;
  var examinee;
  beforeEach(async () => {
    token = await authenticator.registerAdministrator(administrator);
    let decoded = await Authenticator.verifyAndReturnPayload(token);
    examinee.administrator = decoded.administrator_id;
    await authenticator.registerExaminee(examinee, token);
  });
  test("An administrator unregiters an examinee", async () => {
    let returned = await authenticator.unregisterExaminee(token, examinee);
    expect(returned).not.toBeNull();
    expect(returned).toBeTruthy();
    expect(returned).toBe(examinee.username);
  });
  afterAll(async () => {
    let token = authenticator.loginAdministrator(administrator);
    authenticator.unregisterAdministrator(token);
  });
});
