const { rule } = require("graphql-shield")
const { UnauthroizedError } = require('../utils')

// Rules
const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        return ctx.user !== null
    },
)

const isAdmin = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        if (ctx.user.role !== 'administrator') return new UnauthroizedError('Administrator level authorization is required.')
        return true
    },
)

const isExaminee = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        if(ctx.user.role !== 'examinee') return new UnauthroizedError('Examinee Level authorization is required.')
        return true
    },
)

const isProctor = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        if(ctx.user.role !== 'proctor') return new UnauthroizedError('Proctor Level authorization is required.')
        return true
    },
)

module.exports = {
    isAuthenticated,
    isAdmin,
    isProctor,
    isExaminee
}