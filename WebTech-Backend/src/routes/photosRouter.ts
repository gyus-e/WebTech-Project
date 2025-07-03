import express from 'express';
import { getPhotos } from '../controllers/photosController.js';

export const photosRouter = express.Router();


/**
 * @swagger
 *  /photos:
 *     get:
 *       description: Get all photos
 *       responses:
 *           200:
 *             description: List of all photos
 *           404:
 *             description: No photos found
 *           500:
 *             description: Internal server error
 */
photosRouter.route('/')
    .get(getPhotos);