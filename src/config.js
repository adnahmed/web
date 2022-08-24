switch (process.env.NODE_ENV) {
    case 'DEBUG':
        module.exports = require('./config.dev')
        break
    case 'PROD':
        module.exports = require('./config.prod')
        break
}
