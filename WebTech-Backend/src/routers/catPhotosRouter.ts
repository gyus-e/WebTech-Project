import express from 'express';
import { getPhotos, postPhotos, getPhotoById, deletePhotoById } from '../controllers/catPhotosController.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';

export const catPhotosRouter = express.Router({ mergeParams: true });

catPhotosRouter.route(`/`)
    .get(getPhotos)
    .post([enforceAuthentication], postPhotos);

catPhotosRouter.route(`/:photo_id`)
    .get(getPhotoById)
    .delete([enforceAuthentication], deletePhotoById);
