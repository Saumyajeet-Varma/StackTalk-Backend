import { Router } from "express"
import { body } from "express-validator"
import { authUser } from "../middlewares/auth.middleware.js"
import { addUsersController, createProjectController, getAllProjectsController, getProjectByIdController } from "../controllers/project.controller.js"

const router = Router()

router.post("/create",
    authUser,
    body('projectName').isString().withMessage('Name is required'),
    createProjectController
)

router.get("/all",
    authUser,
    getAllProjectsController
)

router.put("/add-users",
    authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail().custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    addUsersController
)

router.get("/project/:projectId",
    authUser,
    getProjectByIdController
)

export default router