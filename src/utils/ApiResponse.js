class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode      // HTTP status code for the response
        this.data = data                  // Actual data to send in the response
        this.message = message            // Message describing the response
        this.success = statusCode < 400   // Success flag based on status code
    }
}