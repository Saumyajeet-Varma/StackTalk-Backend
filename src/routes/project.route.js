import { Router } from "express"
import { body } from "express-validator"
import { authUser } from "../middlewares/auth.middleware.js"
import { createProjectController } from "../controllers/project.controller.js"

const router = Router()

router.post("/create",
    authUser,
    body('projectName').isString().withMessage('Name is required'),
    createProjectController
)

export default router