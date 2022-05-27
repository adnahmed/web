const bcrypt = require('bcrypt');
const db = require('../db');
const authenticate = async (username, password, role, cb) => {
    const { rows } = await db.query(`select * from ${roleTable} where username = $1`, [username]);
    var storedHashedPassword = rows[0].password;
    bcrypt.compare(password, storedHashedPassword,(err, isValid) => {
        if(err) return cb(err);
        if(isValid) {
            var payload = {
                username: req.body.username,
                role: req.body.role,
            };
            return cb(null, payload);
        }
    });
}