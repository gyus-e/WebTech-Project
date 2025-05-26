import express from 'express';
import { getLogin, postLogin } from '../controllers/loginController.js';

export const loginRouter = express.Router();

loginRouter.route(`/`)
    .get(getLogin)
    .post(postLogin);