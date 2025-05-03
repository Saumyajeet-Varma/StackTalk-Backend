import { Router } from "express";
import { loginController, registerController } from "../controllers/user.controller.js";
import { body } from "express-validator";

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

export default router