import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";

export const registerController = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await createUser(req.body);

        const token = await user.generateJWT();

        res.status(201).json({ user, token });
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

export const loginController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const isCorrect = await user.isValidPassword(password);

        if (!isCorrect) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }

        const token = await user.generateJWT();

        res.status(200).json({ user, token });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {
    res.status(200).json({ user: req.user })
}