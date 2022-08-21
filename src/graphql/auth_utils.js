const neo4j = require('../db/neo4j')
const cypher = require('../db/cypher/index')
const jwt = require('jsonwebtoken')
const config = require('../config')
const logger = require("../logger")

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
async function checkExistingUsername(username, creatingNewUser) {
    const userQueryResponse = await neo4j.read(cypher('get-user-by-username'), {
        username: username,
    })
    if (userQueryResponse.records.length == 0) {
        if (!creatingNewUser)
            throw new UsernameError(UsernameError.DOES_NOT_EXISTS, username)
    } else {
        if (creatingNewUser)
            throw new UsernameError(UsernameError.ALREADY_EXISTS, username)
        return userQueryResponse.records[0].get(0).properties
    }
}

class UsernameError extends Error {
    static ALREADY_EXISTS = 0
    static DOES_NOT_EXISTS = 1
    constructor(type, username) {
        super()
        this.code = 403
        if (type == UsernameError.ALREADY_EXISTS)
            this.message = `Username already exists: ${username}`
        else if (type == UsernameError.DOES_NOT_EXISTS)
            this.message = `Username does not exists: ${username}`
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
    UsernameError, 
    ErrorResponse, 
    checkExistingUsername, 
    getUserRole, 
    RoleFetchError,
    checkExistingEmail,
    EmailError,
    getUser,
    Roles
}
