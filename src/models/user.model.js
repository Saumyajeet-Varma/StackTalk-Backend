import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email must be at least 6 6 characters"],
        maxLength: [50, "Email must not be longer than 50 characters"],
    },

    password: {
        type: String,
        required: true,
        select: false,
    }
})

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}

const User = mongoose.model("user", userSchema)

export default User