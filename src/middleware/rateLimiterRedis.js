const redis = require('redis')
const { RateLimiterRedis } = require('rate-limiter-flexible')
const logger = require('../logger')
module.exports = (async () => {
    const redisClient = redis.createClient({
        host: 'edis',
        port: 6379,
        enable_offline_queue: false,
    })

    try {
        await redisClient.connect()
        console.log('Redis cache Connected.')
    } catch (err) {
        logger.warn(`Redis Connection failed: error ${err.message}`)
        throw err
    }
    const rateLimiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'middleware',
        points: 100, // 100 requests
        inmemoryBlockOnConsumed: 100, // no key push to redis after points >= 100
        duration: 1, // per 1 second for IP
    })

    return (req, res, next) => {
        rateLimiter
            .consume(req.ip)
            .then(() => {
                next()
            })
            .catch((err) => {
                res.status(429).send('Too Many Requests.')
            })
    }
})();
