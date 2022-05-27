const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secret = require('../config').secret;
const authenticate = require('../lib/authenticate');
router.post(
    '/',
    body('username').isLength({ min: 1 }).trim().withMessage('Username is required'),
    body('password').isLength({ min: 1}).trim().withMessage('Password is required'),
    body('role').isLength({ min: 1}).trim().withMessage('Role is required ')
    .matches(RegExp('administrator|proctor|examinee')).withMessage('Role can be either administrator, proctor or examinee only.'),
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
        {
            return res.status(422).json({ errors: errors.array() });
        }

        let roleTable = req.body.role +='s';

        authenticate(req.body.username, req.body.password, roleTable, function(err, payload) {
            if (err) return next(err);

            if(payload) {
                jwt.sign(payload, secret, function(err, token) {
                    if (err) return next(err);
                    return res.status(200).send(token);
                });

            } else {
                return res.status(401).send('Invalid Credentials');
            }
        });
    }
);

module.exports = router;