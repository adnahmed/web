const db = require('../models/index');
async function getUser(payload) {
    const user = await db[payload.role].findOne({
        where: {id: payload.sub}
    })
    if(!user)
        throw new Error(`${payload.role} not Found.`);
    return user;
}

module.exports = { getUser };