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