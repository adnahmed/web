require('dotenv').config()
switch (process.env.NODE_ENV || 'debug') {
    case 'production':
        module.exports = require('./config.prod')
        break
    case 'debug':
        module.exports = require('./config.dev')
        break
}
