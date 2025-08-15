import { Router } from "express"; // Express router
import{ registerUser} from "../controllers/user.controller.js"; // User registration controller
import { upload } from "../middlewares/multer.middleware.js"; // Multer middleware for file upload

const router = Router() // Create router

// Registration route with file upload middleware
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", // Avatar image field
            maxCount: 1      // Only one avatar allowed
        },
        {
            name: "coverImage", // Cover image field
            maxCount: 1         // Only one cover image allowed
        }
    ]),
    registerUser // Registration handler
)

export default router // Export router