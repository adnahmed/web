var Mock = require("./__mocks__");
var Authenticator = require("../Authenticator");
var authenticator = Authenticator.defaultAuthenticator;
var administrator = Mock.administrator;

/* Registeration */
describe("Testing Administrator Registeration", () => {
  /* multiple tests might use same value to register therefore truncate before */
  beforeEach(async () => {
    await pool.query(adminQueries.truncateAdministrators);
  });

  afterAll(async () => {
    await pool.query(adminQueries.truncateAdministrators);
  });
});

test("Recieve token after registering new Administrator", async () => {
  let token = await authenticator.registerAdministrator(administrator);
  expect(token).not.toBeNull();
  let decodedToken = await Authenticator.verifyAndReturnPayload(token);
  expect(decodedToken.username).toBe("admin");
});

test("Recieve Error if username for Administrator already exists", () => {
  expect.assertions(1);
  return authenticator.registerAdministrator(administrator).then(() => {
    return authenticator.registerAdministrator(administrator).catch((err) => {
      expect(err).not.toBeNull();
    });
  });
});

/* Authentication */
describe("Testing Administrator Authentication", () => {
  test("Administrator can login with username, password", async () => {
    let token = await authenticator.loginAdministrator(administrator);
    expect(token).not.toBe(expect.anything());
  });

  test("Throw error with unknown username for administrator", async () => {
    administrator.username = "unknown_administrator";
    await expect(
      authenticator.loginAdministrator(administrator)
    ).rejects.toThrow(Error("Username not Found"));
  });

  test("Throw error with invalid password for administrator", async () => {
    administrator.password = "invalid_password";
    await expect(
      authenticator.loginAdministrator(administrator)
    ).rejects.toThrow(Error("Invalid Credentials"));
  });
});

/* Unregisteration */
describe("Unregister Administrator", () => {
  var token;
  beforeAll(async () => {
    authenticator.unregisterAdministrator(administrator);
    token = await authenticator.registerAdministrator(administrator);
  });
  test("Administrator unregisters", async () => {
    let res = await authenticator.unregisterAdministrator(token);
    expect(res).toBe(administrator.username);
  });
});
