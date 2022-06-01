const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const defaultAuthenticator = Authenticator.defaultAuthenticator;
const auth = require('../lib/expressjwt-auth');
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
      let token = await defaultAuthenticator.loginAdministrator(req.body.username, req.body.password);
      res.status(200).send(token);
    } catch(err) {
      res.status(401).send("Administrator already exists.");
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
    auth.required,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      try {
        await defaultAuthenticator.registerProctor(req.auth.id, req.body.username, req.body.password, req.body.first_name, req.body.last_name);
        res.status(200).send("Proctor registered.");
      } catch (err) {
        res.status(401).send(err);
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
    auth.required,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() 
      });
      try {
        await defaultAuthenticator.registerExaminee(req.auth.id,req.body.username, req.body.password, req.body.first_name, req.body.last_name);
        res.status(200).send("Examinee registered.")
      } catch (err) {
        res.status(401).send(err.message);
      }
    });

module.exports = router;
