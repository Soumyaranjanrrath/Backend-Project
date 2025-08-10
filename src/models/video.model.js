import mongoose, {mongo, Schema} from "mongoose";           // Import mongoose and Schema
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // Pagination plugin

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,                                   // Video file URL
            required: true
        },
        thumbnail: {
            type: String,                                   // Thumbnail image URL
            required: true
        },
        title: {
            type: String,                                   // Video title
            required: true
        },
        description: {
            type: String,                                   // Video description
            required: true
        },
        duration: {
            type: Number,                                   // Video duration in seconds
            required: true
        },
        views: {
            type: Number,                                   // Number of views
            default: 0
        },
        isPublished: {
            type: Boolean,                                  // Publish status
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,                    // Reference to User
            ref: "User"
        }
    },
    {
        timestamps: true                                    // Adds createdAt and updatedAt fields
    }
)

videoSchema.plugin(mongooseAggregatePaginate)               // Add pagination plugin
export const Video = mongoose.model("Video", videoSchema)   // Export Video model