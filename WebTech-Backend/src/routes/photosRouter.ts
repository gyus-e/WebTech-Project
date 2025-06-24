import express from 'express';
import { getPhotos } from '../controllers/photosController.js';

export const photosRouter = express.Router();

photosRouter.route('/')
    .get(getPhotos);