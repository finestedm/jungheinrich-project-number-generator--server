import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add name']
        },
        email: {
            type: String,
            required: [true, 'Please add email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add password'],
        },
        branch: {
            type: String,
            required: [true, 'Choose a branch'],
        },
        isAdmin: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

export default User