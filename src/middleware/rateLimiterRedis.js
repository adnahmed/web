const redis = require("redis");
const {RateLimiterRedis} = require("rate-limiter-flexible");

const redisClient =  redis.createClient({
    host: 'redis',
    port: 6379,
    enable_offline_queue: false,
});

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'middleware',
    points: 100, // 100 requests
    inmemoryBlockOnConsumed: 100, // no key push to redis after points >= 100
    duration: 1 // per 1 second for IP
});

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(()=> {
            next();
        })
        .catch(err => {
            res.status(429).send("Too Many Requests.");
        });
};
module.exports = rateLimiterMiddleware;