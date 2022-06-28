const { AuthenticationError } = require('apollo-server-express');
const logger = require('../logger');
const db = require('../models/index');
async function getUser(payload, ip) {
    try {
        const user = await db[payload.role].findOne({
            where: {id: payload.sub}
        })
        return user;
    } catch (err) {
        logger.warn(`Invalid role provided from: ${ip}`);
    }
}

module.exports = { getUser };