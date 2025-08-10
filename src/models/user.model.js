import mongoose, {Schema} from 'mongoose';           // Import mongoose and Schema
import jwt from "jsonwebtoken";                      // Import JWT for token generation
import bcrypt from "bcrypt";                         // Import bcrypt for password hashing

const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,                           // Username is required
            unique: true,                            // Must be unique
            lowcase: true,                           // Should be lowercase (typo: should be 'lowercase')
            trim: true,                              // Remove whitespace
            index: true                              // Add index for faster search
        },
        email: {
            type: String,
            require: true,                           // Email is required
            unique: true,                            // Must be unique
            lowcase: true,                           // Should be lowercase (typo: should be 'lowercase')
            trim: true,                              // Remove whitespace
        },
        fullname: {
            type: String,
            require: true,                           // Full name is required
            trim: true,                              // Remove whitespace
            index: true                              // Add index for search
        },
        avatar: {
            type: String,                            // User avatar URL
            require: true                            // Required
        },
        coverImage: {
            type: String,                            // Cover image URL (optional)
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,         // Reference to Video
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]  // Password is required
        },
        refreshToken: {
            type: String                             // Stores refresh token
        },
    },
    {
        timestamps: true                             // Adds createdAt and updatedAt fields
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Only hash if password changed
    this.password = bcrypt.hash(this.password, 10)   // Hash password (should await)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return  await bcrypt.compare(password, this.password) // Compare passwords
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,                           // User ID
            email: this.email,                       // User email
            username: this.username,                 // Username
            fullname: this.fullname                  // Full name
        },
        process.env.ACCESS_TOKEN_SECRET,             // Secret key
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Token expiry
        }
    )
}
userSchema.methods.generateRefrehToken = function() {
    return jwt.sign(
        {
            _id: this._id                            // User ID only
        },
        process.env.REFRESH_TOKEN_SECRET,            // Refresh token secret
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Refresh token expiry
        }
    )
}

export const User = mongoose.model("User", userSchema) // Export User model