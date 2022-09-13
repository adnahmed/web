const rateLimitRule = require('./rateLimitRule')
const { shield } = require('graphql-shield')
const permissions = shield({
    Mutation: {
        createExam: rateLimitRule({window: '1s', max: 2}),
    },
})

module.exports = permissions;