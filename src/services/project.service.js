import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ projectName, userId }) => {

    try {
        if (!projectName) {
            throw new Error("Project name is required")
        }

        if (!userId) {
            throw new Error("User is required")
        }

        const projectExist = await projectModel.findOne({ projectName })

        if (projectExist) {
            throw new Error("Project already exist !")
        }

        const project = await projectModel.create({
            projectName,
            users: [userId]
        })

        return project
    }
    catch (err) {
        console.error(err)
    }
}

export const getUserProjects = async ({ userId }) => {

    try {
        if (!userId) {
            throw new Error("User is required")
        }

        const userProjects = await projectModel.find({ users: userId })

        return userProjects
    }
    catch (err) {
        console.error(err)
    }
}

export const addUsers = async ({ userId, projectId, users }) => {

    try {
        if (!projectId) {
            throw new Error("Project is required")
        }

        if (!mongoose.isValidObjectId(projectId)) {
            throw new Error("Invalid projectId")
        }

        if (!users) {
            throw new Error("Users are required")
        }

        if (!Array.isArray(users) || users.some(userId => !mongoose.isValidObjectId(userId))) {
            throw new Error("Invalid userId(s) in users array")
        }

        if (!userId) {
            throw new Error("User is required")
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw new Error("Invalid userId")
        }

        const project = await projectModel.findOne({
            _id: projectId,
            users: userId
        })

        if (!project) {
            throw new Error("User not belong to this project");
        }

        const updatedProject = await projectModel.findOneAndUpdate(
            {
                _id: projectId
            },
            {
                $addToSet: {
                    users: {
                        $each: users
                    }
                }
            },
            {
                new: true
            }
        )

        return updatedProject
    }
    catch (err) {
        console.error(err)
    }
}

export const getProjectById = async ({ projectId }) => {

    try {
        if (!projectId) {
            throw new Error("Project is required")
        }

        if (!mongoose.isValidObjectId(projectId)) {
            throw new Error("Invalid projectId")
        }

        const project = await projectModel.findOne({ _id: projectId }).populate("users")

        return project
    }
    catch (err) {
        console.error(err)
    }
}

export const updateFileTree = async ({ projectId, fileTree }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.isValidObjectId(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findOneAndUpdate(
        {
            _id: projectId
        },
        {
            fileTree
        },
        {
            new: true
        }
    )

    return project;
}