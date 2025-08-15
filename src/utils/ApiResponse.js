class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode      // HTTP status code
        this.data = data                  // Response data
        this.message = message            // Response message
        this.success = statusCode < 400   // True if status is success
    }
}

export {ApiResponse} // Export response class