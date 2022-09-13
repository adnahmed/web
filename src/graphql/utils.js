const { Neo4jError } = require("neo4j-driver")

class ErrorQueryResponse {
    constructor(err) {
       if (err.name === 'Neo4jError') {
            this.code = 500
       }
       else {
        this.code = err.code
       }
        this.message = err.message
        this.success = false
    }
}

class UnauthroizedError extends Error {
    constructor(meta) {
        super()
        this.code = 403
        this.message = `You are unauthorized to perform this action.` + (meta ? ` ${meta}` : "")
        this.success = false
    }
}
class QueryResponse {
    constructor(code, message, success){
        this.code = code
        this.message = message
        this.success = success
    }
}
class OKQueryResponse extends QueryResponse {
    constructor(message) {
        super(200, 'Opeartion Successful', true)
        if (message) this.message = message
    }
}

module.exports = {
    ErrorQueryResponse,
    UnauthroizedError,
    QueryResponse,
    OKQueryResponse
}