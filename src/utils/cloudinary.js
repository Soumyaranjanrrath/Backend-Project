import { v2 as cloudinary } from 'cloudinary';      // Import Cloudinary SDK
import fs from "fs"                                 // Import Node.js file system module

// Configure Cloudinary with credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloud name from .env
    api_key: process.env.CLOUDINARY_API_KEY,        // API key from .env
    api_secret: process.env.CLOUDINARY_API_SECRET   // API secret from .env
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null             // If no file path, return null
        // Upload file to Cloudinary
        const respose = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'                   // Auto-detect file type (image, video, etc.)
        })
        // Log and return upload response
        //console.log("file is uploaded on cloudinary", respose.url);
        fs.unlinkSync(localFilePath)                // Delete local file after upload
        return respose;

    } catch (error) {
        fs.unlinkSync(localFilePath)                // Delete local file if upload fails
        return null;
    }
}

export{uploadOnCloudinary}                          // Export the upload function