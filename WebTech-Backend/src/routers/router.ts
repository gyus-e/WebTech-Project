import express from 'express';
import { getIndex } from '../controllers/controller.js'; 
import { catsRouter } from './catsRouter.js';
import { loginRouter } from './loginRouter.js';

export const router = express.Router();

router.get(`/`, getIndex);
router.use(`/login`, loginRouter);
router.use(`/cats`, catsRouter);