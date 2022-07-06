// https://expressjs.com/en/guide/error-handling.html

const { Neo4jError } = require("neo4j-driver")

module.exports = (err) => {
    if ( err instanceof Neo4jError ) {
        if ( err.message.includes('already exists with') ) {
            const [ _, property ] = err.message.match(/`([a-z0-9]+)`/gi)
            message = `${property.replace(/`/g, '')} already taken`;
            return {
                    code: 400,
                    message: message,
                    success: false
            }
        }
        // Neo.ClientError.Schema.ConstraintValidationFailed
        // Node(54778) with label `Test` must have the property `mustExist`
        else if ( err.message.includes('must have the property') ) {
            const [ _, property ] = err.message.match(/`([a-z0-9]+)`/gi)
            message = `${property.replace(/`/g, '')} should not be empty`;
            return {
                code: 400,
                message: 'Bad Request',
                success: false
                }
        }
    }
}
