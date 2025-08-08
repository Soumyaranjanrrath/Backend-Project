class ApiError extends Error {
    constructor(
        statusCode,                      // HTTP status code for the error
        message = "Something went wrong",// Default error message
        errors = [],                     // Array of specific error details
        stack = ""                       // Optional stack trace
    ){
        super(message)                   // Call parent Error with message
        this.statusCode = statusCode     // Set HTTP status code
        this.data = null                 // Placeholder for extra error data
        this.message = message           // Error message
        this.success = false;            // Always false for errors
        this.errors = errors             // Store error details

        if(stack){
            this.stack = stack           // Use provided stack trace if any
        }else{
            Error.captureStackTrace(this, this.constructor) // Capture stack trace
        }
    }
}