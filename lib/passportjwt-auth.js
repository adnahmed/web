var passport = require('passport');
var secret = require('../config').secret;
var JWTStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var logger = require('../logger/index')
const db = require('../models/index');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use('administrator', new JWTStrategy(opts, async function(jwt_payload, done) {
    try {
        let administrator = await db['administrator'].findOne({
            where: { id: jwt_payload.sub }
        });
        if (!administrator) {
            logger.warn(`Invalid Token or administrator not found, cannot authorize`);
            return done(null, false);
        }
        
        logger.log(
        "info",
        `Administrator ${administrator.username} was authorized`
      );
        return done(null, administrator);
    } catch (err) {
        logger.warn(`Administrator not authorized, error: ${err}`);
        return done(err, false);
    }
}));

passport.use('proctor', new JWTStrategy(opts, async function(jwt_payload, done) {
    try {
        let proctor = await db['proctor'].findOne({
            where: { id: jwt_payload.sub }
        });
        if (!proctor) {
            logger.warn(`Invalid Token or proctor not found, cannot authorize`);
            return done(null, false);
        }
        
        logger.log(
        "info",
        `Proctor ${username} was authorized`
      );
        return done(null, proctor);
    } catch (err) {
        logger.warn(`Proctor was not authorized, error: ${err}`);
        return done(err, false);
    }
}));

passport.use('examinee', new JWTStrategy(opts, async function(jwt_payload, done) {
    try {
        let examinee = await db['examinee'].findOne({
            where: { id: jwt_payload.sub }
        });
        if (!examinee) {
            logger.warn(`Invalid Token or administrator not found, cannot authorize`);
            return done(null, false);
        }
        
        logger.log(
        "info",
        `Examinee ${username} was authorized`
      );
        return done(null, examinee);
    } catch (err) {
        logger.warn(`Examinee not authorized, error: ${err}`);
        return done(err, false);
    }
}));

module.exports = passport;