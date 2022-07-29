// TODO: Implement rate limiter for graphql
const rateLimiter = require('graphql-rate-limit');
const redis = require('redis')
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

var opts;
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
    }).catch(err => {
            console.log(err.message);
            logger.warn(err.message);
    })
}
connectToRedis()


