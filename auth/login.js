const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const Administrator = require("../models/administrator");
const Proctor = require("../models/proctor");

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
      token = await defaultAuthenticator.loginAdministrator(
        new Administrator(req.body.username, req.body.password)
      );
    } catch (err) {
      res.status(401).send('{"message":"Username not Found"}');
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    res.send(
      defaultAuthenticator.loginProctor(
        new Proctor(req.body.username, req.body.password)
      )
    );
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    res.send(
      defaultAuthenticator.loginExaminee(
        new Examinee(req.body.username, req.body.password)
      )
    );
  }
);

module.exports = router;
