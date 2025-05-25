import express from 'express';
import { } from '../middleware/middleware.js';
import { getCats, postCats, getCatById, putCatById, deleteCatById } from '../controllers/catsController.js';
import { catPhotosRouter } from './catPhotosRouter.js';

export const catsRouter = express.Router();

catsRouter.route(`/`)
    .get(getCats)
    .post(postCats);

catsRouter.route(`/:cat_id`)
    .get(getCatById)
    .put(putCatById)
    .delete(deleteCatById);

catsRouter.use(`/:cat_id/photos`, catPhotosRouter);