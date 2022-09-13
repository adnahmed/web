const Redis = require('ioredis')
const logger = require('../logger')
const fs = require('fs')

if(process.env.NODE_ENV === "production" && process.env.REDIS_TLS_CA) {
    redisOptions.tls = {
        ca: fs.readFileSync(process.env.REDIS_TLS_CA)
    }
}
const redisClient = new Redis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB,
    retryStrategy: (numberRetries) => {
        if (numberRetries > process.env.REDIS_MAX_CONNECTION_RETRY) {
            // End reconnecting with built in error
            return new Error(
                'Could not Connect to Redis: Max number of retries reached.'
            )
        }
        logger.warn('Retrying Redis Connection ... Retry#' + numberRetries)
        // reconnect after
        return Math.min(
            numberRetries * 100,
            process.env.REDIS_RECONNECT_TIME
        )
    },
})

redisClient.on('ready', () => {
    logger.info('Redis Client Connected.')
})

redisClient.on('error', (err) => {
    logger.error(err.message)
})

module.exports = redisClient
