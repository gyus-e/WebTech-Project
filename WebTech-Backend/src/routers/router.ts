import express from 'express';
import { getIndex } from '../controllers/controller.js'; 
import { catsRouter } from './catsRouter.js';

export const router = express.Router();

router.get(`/`, getIndex);
router.use(`/cats`, catsRouter);