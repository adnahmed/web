const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const defaultAuthenticator = Authenticator.defaultAuthenticator;
const passport = require('../lib/passportjwt-auth');
var router = express.Router();
router.post(
  "/administrator",
  passport.authenticate('administrator', { session: false }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    try {
      await defaultAuthenticator.unregisterAdministrator(req.administrator);
      res.status(200).send("Administrator unregistered.");
    } catch(err) {
      res.status(500).send(err.message);
    }
  }
);

router.post(
    "/proctor",
    body("username")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Username is required"),
    passport.authenticate('administrator', { session: false }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      try {
        await defaultAuthenticator.unregisterProctor(req.user, req.body.username);
        res.status(200).send("Proctor unregistered.");
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  );
  


  router.post(
    "/examinee",
    body("username")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Username is required"),
    passport.authenticate('administrator', { session: false }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() 
      });
      try {
        await defaultAuthenticator.unregisterExaminee(req.user, req.body.username);
        res.status(200).send("Examinee unregistered.");
      } catch (err) {
        res.status(500).send(err.message);
      }
    });

module.exports = router;
