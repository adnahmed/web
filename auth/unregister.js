const express = require("express");
const Authenticator = require("../lib/Authenticator");
const { body, validationResult } = require("express-validator");
const defaultAuthenticator = Authenticator.defaultAuthenticator;
const auth = require('../lib/expressjwt-auth');
var router = express.Router();
router.post(
  "/administrator",
  auth.required,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    try {
      await defaultAuthenticator.unregisterAdministrator(req.auth.id);
      res.status(200).send("Administrator unregistered.");
    } catch(err) {
      res.status(500).send(err);
    }
  }
);

router.post(
    "/proctor",
    auth.required,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      try {
        await defaultAuthenticator.unregisterProctor(req.auth.adminId, req.auth.id);
        res.status(200).send("Proctor unregistered.");
      } catch (err) {
        res.status(500).send(err);
      }
    }
  );
  


  router.post(
    "/examinee",
    auth.required,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() 
      });
      try {
        await defaultAuthenticator.unregisterExaminee(req.auth.adminId, req.auth.id);
        res.status(200).send("Examinee unregistered.");
      } catch (err) {
        res.status(500).send(err);
      }
    });

module.exports = router;
