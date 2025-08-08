import mongoose from "mongoose";                  // Import mongoose for MongoDB
import { DB_NAME } from "../constants.js";         // Import DB name constant

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.
        MONGO_URI}/${DB_NAME}`)                    // Connect to MongoDB
        console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`); // Log success
        
    } catch (error) {
        console.log("MONGODB connection error", error); // Log connection error
        process.exit(1)                                 // Exit process on failure
    }
}

export default connectDB;                              // Export the connection function