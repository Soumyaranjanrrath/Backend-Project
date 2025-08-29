import {asyncHandler} from "../utils/asyncHandler.js"; // Error handler for async routes
import {ApiError} from "../utils/ApiError.js" // Custom error class
import { User } from "../models/user.model.js" // User model
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Cloudinary upload helper
import { ApiResponse } from "../utils/ApiResponse.js"; // API response wrapper


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefrehToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // Get user details from request body
    const {fullname, email, username, password } = req.body
    //console.log("email :", email);

    // Validate all fields are present
    if (
       [fullname, email, username, password].some(() => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if user already exists
    const existedUser = awaitUser.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists.")
    }
    console.log(req.files);
    

    // Get avatar and cover image file paths
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    // Avatar is required
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // Upload avatar and cover image to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // Avatar upload must succeed
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    // Create user in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Remove sensitive fields from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken "
    )

    // Check user creation success
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong registering the user")
    }
    
    // Send success response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body ---> Data
    // username or email
    // find the user 
    // check the password
    // access and refresh token
    // send cookie 


    const  {email, username, password} = req.body

    if (!username || !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPaswordValid = await user.isPasswordCorrect(password)

    if (!isPaswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(2000)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, 
        {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged in successfully"
    ))

})

const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        },
        {
            new: true
        }
    })

})

export { registerUser, loginUser, logoutUser } // Export registration handler
