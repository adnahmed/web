const redis = require('redis')
const { RateLimiterRedis } = require('rate-limiter-flexible')
const logger = require('../logger')
const config = require('../config').redis
const redisClient = redis.createClient({
    enable_offline_queue: false,
    username: config.username,
    password: config.password,
    socket: {
        host: config.REDIS_HOST,
        port: 6379,
        reconnectStrategy: (numberRetries) => {
            if (numberRetries > config.MAX_CONNECTION_RETRY) {
                // End reconnecting with built in error
                return new Error("Could not Connect to Redis: Max number of retries reached.");
            }
            console.log(
                'Retrying Redis Connection ... Retry#' + numberRetries
            );
            // reconnect after
            return Math.min(numberRetries * 100, config.RECONNECT_TIME)
        },
    },
})

redisClient.on('ready', ()=> {
    console.log("Redis Client Connected.");
})

redisClient.on('error', (err) => {
    // console.log("Redis:" + err.message);
    logger.warn(err.message)
});

var opts, rateLimiterRedis
function connectToRedis() {
    redisClient.connect().then(() => {
        opts = {
            // Basic options
            storeClient: redisClient,
            points: 5, // Number of points
            duration: 5, // Per second(s)

            // Custom
            execEvenly: false, // Do not delay actions evenly
            blockDuration: 0, // Do not block if consumed more than points
            keyPrefix: 'rlflx', // must be unique for limiters with different purpose
        }
        rateLimiterRedis = new RateLimiterRedis(opts)
    }).catch(err => {
            console.log(err.message);
            logger.warn(err.message);
    })
}
connectToRedis()
function rateLimitMiddleware(req, res, next) {
    rateLimiterRedis
        .consume(req.ip)
        .then((rateLimiterRes) => {
            // ... Some app logic here ...
        })
        .catch((rejRes) => {
            if (rejRes instanceof Error) {
                // Some Redis error
                // Never happen if `insuranceLimiter` set up
                // Decide what to do with it in other case
            } else {
                // Can't consume
                // If there is no error, rateLimiterRedis promise rejected with number of ms before next request allowed
                const secs = Math.round(rejRes.msBeforeNext / 1000) || 1
                res.set('Retry-After', String(secs))
                res.status(429).send('Too Many Requests')
            }
        })
}

module.exports = rateLimitMiddleware
