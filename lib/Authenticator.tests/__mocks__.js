var Administrator = require("../../models/administrator");
var Proctor = require("../../models/proctor");
var Examinee = require("../../models/examinee");

class Mocks {
  static administrator = new Administrator(
    "admin", // Username
    "admin123!", // Password
    "admin", // First Name
    "admin" // Last Name
  );
  static _base_administator = Mocks.administrator;
  static proctor = new Proctor(
    null, // Administrator ID
    "proctor", // Username
    "proctor123!", // Password
    "proctor", // First Name
    "proctor" // Last Name
  );
  static _base_proctor = Mocks.proctor;

  static examinee = new Examinee(
    null, // Administrator ID
    "examinee", // Username
    "examinee123!", // Password
    "examinee", // First Name
    "examinee" // Last Name
  );
  static _base_examinee = Mocks.examinee;

  static resetAll() {
    resetAdministrator();
    resetProctor();
    resetExaminee();
  }
  static resetAdministrator() {
    administrator = _base_administator;
  }
  static resetProctor() {
    proctor = _base_proctor;
  }
  static resetExaminee() {
    examinee = _base_examinee;
  }
}

module.exports = Mocks;
