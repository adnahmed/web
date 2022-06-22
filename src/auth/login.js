const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const defaultAuthenticator = Authenticator.defaultAuthenticator;

var router = express.Router();

router.post(
  "/administrator",
  body("username")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Username is required"),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    var token;
    try {
      token = await defaultAuthenticator.loginAdministrator(req.body.username, req.body.password);
    } catch (err) {
      res.status(401).send(err.message);
    }
    res.status(200).send(token);
  }
);

router.post(
  "/proctor",
  body("username")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Username is required"),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
      var token;
      try {
        token = await defaultAuthenticator.loginProctor(req.body.username, req.body.password);
      } catch (err) {
        res.status(401).send(err.message);
      }
      res.status(200).send(token);
  }
);

router.post(
  "/examinee",
  body("username")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Username is required"),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password is required"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
      var token;
      try {
        token = await defaultAuthenticator.loginExaminee(req.body.username, req.body.password);
      } catch (err) {
        res.status(401).send(err.message);
      }
      res.status(200).send(token);
  }
);

module.exports = router;
