import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import { createUser, fetchAllUsers } from "../services/user.service.js";

export const registerController = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Express validation error",
            error: errors.array(),
        });
    }

    try {
        const user = await createUser(req.body);

        const token = await user.generateJWT();

        delete user._doc.password

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: { user, token },
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        })
    }
}

export const loginController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Express validation error",
            error: errors.array(),
        });
    }

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const isCorrect = await user.isValidPassword(password);

        if (!isCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            })
        }

        const token = await user.generateJWT();

        delete user._doc.password

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: { user, token },
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        })
    }
}

export const profileController = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "User profile data fetched",
        data: { user: req.user },
    })
}

export const logoutController = async (req, res) => {

    try {
        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        })
    }
}

export const getAllUserController = async (req, res) => {

    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email })

        const allUsers = await fetchAllUsers({ userId: loggedInUser._id })

        return res.status(200).json({
            success: true,
            message: "All users data fetched successfully",
            data: allUsers,
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err.message,
        })
    }
}