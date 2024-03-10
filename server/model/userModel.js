import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter unique username"],
        unique: [true, "Username already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please enter unique email"],
        unique: [true, "Email already exists"]
    },
    firstName: {type: String},
    lastName: {type: String},
    mobile: {type: Number},
    address: {type: String},
    profile: {type: String},
    blogs: [{                                    //Mark that blogs field is an array. This is because each blog can have one user only but each user can have multiple blogs. 
        type: mongoose.Types.ObjectId,           // So, the user field in blogSchema is not an array but blogs field in userSchema has to be an array.
        ref: "Blog",
    }]
});

export default mongoose.model('User', UserSchema);