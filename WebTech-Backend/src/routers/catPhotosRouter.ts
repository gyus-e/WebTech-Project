import express from 'express';
import { getPhotos, postPhotos, getPhotoById, deletePhotoById } from '../controllers/catPhotosController.js';

export const catPhotosRouter = express.Router({ mergeParams: true });

catPhotosRouter.route(`/`)
    .get(getPhotos)
    .post(postPhotos);

catPhotosRouter.route(`/:photo_id`)
    .get(getPhotoById)
    .delete(deletePhotoById);
