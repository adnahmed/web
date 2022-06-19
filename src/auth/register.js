const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const defaultAuthenticator = Authenticator.defaultAuthenticator;
const passport = require('../lib/passportjwt-auth');
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
    try {
      await defaultAuthenticator.registerAdministrator(req.body.username, req.body.password, req.body.first_name, req.body.last_name);
      res.status(200).send("Administrator registered.");
    } catch(err) {
      res.status(401).send(err.message);
    }
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
    passport.authenticate('administrator', { session: false }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      try {
        await defaultAuthenticator.registerProctor(req.user, req.body.username, req.body.password, req.body.first_name, req.body.last_name);
        res.status(200).send("Proctor registered.");
      } catch (err) {
        res.status(401).send(err.message);
      }
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
      passport.authenticate('administrator', { session: false }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() 
      });
      try {
        await defaultAuthenticator.registerExaminee(req.user,req.body.username, req.body.password, req.body.first_name, req.body.last_name);
        res.status(200).send("Examinee registered.")
      } catch (err) {
        res.status(401).send(err.message);
      }
    });

module.exports = router;
