const neo4j = require('../db/neo4j')
const cypher = require('../db/cypher/index')
const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require("../logger")
const { instance } = require('../db/neo4j')

async function getUserRole(username) {
    const roleQueryRespone = await neo4j
        .read(cypher(`get-user-role`), { username: username })
    if (roleQueryRespone.records.length > 0)
        return roleQueryRespone.records[0].get(0);
    throw new RoleFetchError(username);

}
async function checkExistingEmail(email) {

    const userQueryResponse = await neo4j.read(cypher('get-user-by-email'), {
        email: email,
    })
    if (userQueryResponse.records.length == 0) {
            throw new EmailError(email);
    } else {
        return userQueryResponse.records[0].get(0).properties
    }
}

async function checkExisting(user) {
    const userExists = await instance.first('User',
    {
        username: user.username,
        email: user.email,
    })
    if (userExists) {
        throw new RegisterationError(user.username, user.email)
    }
}

class RegisterationError extends Error {
    static ALREADY_EXISTS = 0
    constructor(username, email) {
        super()
        this.code = 403
        this.message = `User already exists: username: ${username}, email: ${email}`
    }
}
class EmailError extends Error {
    constructor(email) {
        super()
        this.code = 403
        this.message = `Email does not exists: ${email}`
    }
}
class RoleFetchError extends Error {
    constructor(username) {
        super();
        this.message = `Error Occurred Fetching Role for User ${username}`;
        this.code = 500;
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
    const user = await checkExistingUsername(payload.sub, { creatingNewUser: false });
    user.role = await getUserRole (user.username);
    return { status: true, user: user };
}

const Roles = {
    administrator: "administrator",
    proctor: "proctor",
    examinee: "examinee"
};

module.exports = { 
    RegisterationError, 
    ErrorResponse, 
    checkExisting,
    getUserRole, 
    RoleFetchError,
    checkExistingEmail,
    EmailError,
    getUser,
    Roles
}
