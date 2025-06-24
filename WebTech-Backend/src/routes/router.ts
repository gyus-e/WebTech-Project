import express from 'express';
import { getIndex } from '../controllers/controller.js';
import { catsRouter } from './catsRouter.js';
import { authRouter } from './authRouter.js';
import { photosRouter } from './photosRouter.js';

export const router = express.Router();

router.get(`/`, getIndex);
router.use(`/auth`, authRouter);
router.use(`/cats`, catsRouter);
router.use(`/photos`, photosRouter);