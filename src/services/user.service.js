import userModel from "../models/user.model.js";

export const createUser = async ({ username, email, password }) => {

    try {
        if (!username || !email || !password) {
            throw new Error("All fields are required")
        }

        const hashedPassword = await userModel.hashPassword(password)

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        })

        return user
    }
    catch (err) {
        console.error(err)
    }
}

export const fetchAllUsers = async ({ userId }) => {

    const users = await userModel.find({
        _id: { $ne: userId }
    })

    return users
}