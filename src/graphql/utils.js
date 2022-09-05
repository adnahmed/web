class ErrorResponse {
    constructor(err) {
       this.code = err.code
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

module.exports = {
    ErrorResponse,
    UnauthroizedError
}