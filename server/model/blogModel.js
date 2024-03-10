import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title can't be empty"]
    },
    description: {
        type: String,
        required: [true, "description can't be empty!"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "user can't be empty!"]
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    likes: {
      count: {
          type: Number,
          default: 0
      },
      likedBy: [{
          type: mongoose.Types.ObjectId,
          ref: "User"
      }]
    },
    comments: [
        {
          user: {
            userId: {
              type: mongoose.Types.ObjectId,
              ref: "User",
              required: true
            },
            username: {
              type: String,
              required: true
            }
          },
          text: {
            type: String,
            required: true
          }
        }
    ]
});

export default mongoose.model("Blog",blogSchema);