switch (process.env.NODE_ENV.toLowerCase()) {
    case 'production':
        module.exports = require('./config.prod')
        break
    default:
    case 'debug':
        module.exports = require('./config.dev')
        break
}
