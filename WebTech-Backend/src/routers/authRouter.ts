import express from 'express';
import { getAuth, postAuth } from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.route(`/`)
    .get(getAuth)
    .post(postAuth);