import multer from "multer"; // Multer for file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp') // Save files to temp folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use original file name
    }
})

export const upload = multer({
     storage, // Use custom storage config
})