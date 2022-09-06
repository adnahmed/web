const { shield, and, or, not } = require('graphql-shield');
const { UnauthroizedError } = require('../utils');
const { isAuthenticated, isAdmin, isExaminee, isProctor } = require('./rules')

const permissions = shield({
    Mutation: {
        createExam: and(isAuthenticated, isAdmin),
    },
}, {
    fallbackError: new UnauthroizedError()
})

module.exports = permissions;