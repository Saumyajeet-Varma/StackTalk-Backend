import { Router } from "express";
import { body } from "express-validator";
import { getAllUserController, loginController, logoutController, profileController, registerController } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router()

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    registerController
)

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    loginController
)

router.get('/profile',
    authUser,
    profileController
)

router.get('/logout',
    authUser,
    logoutController
)

router.get('/all',
    authUser,
    getAllUserController
)

export default router