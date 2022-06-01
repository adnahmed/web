const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const Administrator = require("../models/administrator");
const Proctor = require("../models/proctor");
const Examinee = require("../models/examinee");
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
    body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First Name is required"),
  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last Name is required"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    var token;
    try {
      token = await defaultAuthenticator.registerAdministrator(
        new Administrator(req.body.username, req.body.password, req.body.first_name, req.body.last_name)
      );
    } catch (err) {
        if(err.message === "Username already registered")
            res.status(409).send("Username already registered");
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
      body("first_name")
      .isLength({ min: 1 })
      .trim()
      .withMessage("First Name is required"),
    body("last_name")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Last Name is required"),
    body("token")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Administrator Token is required"),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      var token;
      try {
        token = await defaultAuthenticator.registerProctor(
          new Proctor(null, req.body.username, req.body.password, req.body.first_name, req.body.last_name)
        , req.body.token);
      } catch (err) {
          if(err.message === "Username already registered")
              res.status(409).send("Username already registered");
          res.send(err);
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
      body("first_name")
      .isLength({ min: 1 })
      .trim()
      .withMessage("First Name is required"),
    body("last_name")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Last Name is required"),
    body("token")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Administrator Token is required"),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      var token;
      try {
        token = await defaultAuthenticator.registerExaminee(
          new Examinee(null, req.body.username, req.body.password, req.body.first_name, req.body.last_name)
        , req.body.token);
      } catch (err) {
          if(err.message === "Username already registered")
              res.status(409).send("Username already registered");
          res.send(err);
      }
      res.status(200).send(token);
    }
  );
module.exports = router;
