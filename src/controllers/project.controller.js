import { validationResult } from "express-validator";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import { createProject } from "../services/project.service.js";

export const createProjectController = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectName } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await createProject({ projectName, userId })

        if (!newProject) {
            return res.status(400).send("Project already exists !")
        }

        return res.status(201).json({ newProject })
    }
    catch (err) {
        res.status(400).send(err.message)
    }
}