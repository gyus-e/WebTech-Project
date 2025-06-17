import express from 'express';
import { postLogin } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.route(`/login`)
    .post(postLogin);