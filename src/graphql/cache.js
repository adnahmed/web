const KeyvRedis = require('@keyv/redis')
const Keyv = require('keyv')
const redisClient = require('./redis')
const logger = require('../logger')
const keyvRedis = new KeyvRedis(redisClient)
const cache = new Keyv({ store: keyvRedis })
cache.on('error', handleRedisConnection)
function handleRedisConnection(error) {
    logger.error(error.message)
}
module.exports = cache