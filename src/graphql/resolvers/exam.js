const { ErrorResponse } = require('../utils')
const { rule, shield, and, or, not } = require("graphql-shield")
module.exports = {
    Mutation: {
        createExam: async (parent, args, context) => {
            try {
                return {
                    code: 200,
                    message: 'Exam Created.',
                    success: true
                }               
            } catch (err) {
                return new ErrorResponse(err)
            }
        },
    },
}

