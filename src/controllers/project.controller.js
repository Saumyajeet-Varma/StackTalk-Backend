import { validationResult } from "express-validator";
import projectModel from "../models/project.model.js";
import userModel from "../models/user.model.js";
import { addUsers, createProject, getProjectById, getUserProjects } from "../services/project.service.js";

export const createProjectController = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Express validation error",
            error: errors.array(),
        });
    }

    try {
        const { projectName } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await createProject({ projectName, userId })

        if (!newProject) {
            return res.status(400).json({
                success: false,
                message: "Project name already exists !",
            })
        }

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject,
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

export const getAllProjectsController = async (req, res) => {

    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const userProjects = await getUserProjects({ userId: loggedInUser._id });

        return res.status(200).json({
            success: true,
            message: "All projects data fetched successfully",
            data: userProjects,
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

export const addUsersController = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Express validation error",
            error: errors.array(),
        });
    }

    try {
        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await addUsers({ userId: loggedInUser._id, projectId, users })

        return res.status(200).json({
            success: true,
            message: "User added successfully",
            data: project
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

export const getProjectByIdController = async (req, res) => {

    try {
        const { projectId } = req.params

        const project = await getProjectById({ projectId })

        if (!project) {
            return res.status(400).json({
                success: false,
                message: "Project doesn't exist !",
            })
        }

        res.status(200).json({
            success: true,
            message: "Project data fetched successfully",
            data: project
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