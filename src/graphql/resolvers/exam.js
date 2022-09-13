const { ErrorResponse } = require('../utils')
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

