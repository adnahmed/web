var passport = require('passport');
var secret = require('../config').secret;
var logger = require('../logger/index')
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

function getUserAndRole(token) {
    let jwt_payload = jwt.verify(token, secret);
    let role = jwt_payload.role;
    let user = await db[role].findOne({
        where: { id: jwt_payload.sub }
    });

    if (!user) {
        logger.warn(`Invalid Token or user not found, cannot authorize`);
        throw new AuthenticationError("User Not Found")
    }

    logger.log(
        "info",
        `${role} ${user.username} was authorized`
    );

    return { user, role };
}
