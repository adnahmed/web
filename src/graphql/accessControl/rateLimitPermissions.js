const rateLimitRule = require('./rateLimitRule')
const permissions = shield({
    Mutation: {
        createExam: rateLimitRule({window: '1s', max: 2}),
    },
})

module.exports = permissions;