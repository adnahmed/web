// TODO: Implement rate limiter for graphql
const { createRateLimitRule, RedisStore } = require('graphql-rate-limit')
const redisClient = require('../redis')
const rateLimitRule = createRateLimitRule({
    identifyContext: (ctx) => {
        if(ctx.user) return ctx.user.id;
        return ctx.req.ip;
    },
    // Basic options
    storeClient: redisClient,
})

module.exports = rateLimitRule
