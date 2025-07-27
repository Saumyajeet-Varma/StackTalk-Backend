import express from 'express';
import { getProjectMessages, saveMessage } from '../controllers/projectMessage.controller.js';

const router = express.Router();

router.get('/:projectId', getProjectMessages);

router.post('/save', saveMessage);

export default router;
