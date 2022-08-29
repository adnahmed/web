switch (process.env.NODE_ENV.toLowerCase()) {
    case 'debug':
        module.exports = require('./config.dev')
        break
    case 'production':
        module.exports = require('./config.prod')
        break
}
