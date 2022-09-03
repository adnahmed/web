const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require("../logger")
const { instance } = require('../db/neo4j')

async function checkExisting(query) {
    const user = query.username ? await instance.first('User', { username: query.username }) : null || query.email ? await instance.first('User', { email: query.email }) : null
    return user;
}

class RegisterationError extends Error {
    constructor(username, email) {
        super()
        this.code = 403
        this.message = `User already exists: username: ${username}, email: ${email}`
    }
}

class AuthenticationError extends Error {
    constructor() {
        super()
        this.code = 403
        this.message = "Invalid Email or username provided."
    }
}
class ErrorResponse {
    constructor(err) {
       this.code = err.code
       this.message = err.message
       this.success = false 
    }
}
async function getUser(req) {
    if (!req.headers.authorization) {
        return new { status: false, user: null }
    }
    const payload = await jwt.verify(req.headers.authorization, config.secret)
    if (!payload.sub || !payload.role){
        logger.warn(`${req.ip}: Malformed JWT Token, ${req.headers.authorization}`);
        return { status: false, user: null };
    } 
    // TODO: Use Redis Cache here to fetch user for username
    const user = await checkExisting({ username: payload.sub });
    if (user)
        return { status: true, user: user };
    return { status: false, user: null }
}

module.exports = { 
    RegisterationError, 
    AuthenticationError,
    ErrorResponse, 
    checkExisting,
    getUser,
}
