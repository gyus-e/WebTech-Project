import express from 'express';
import { getCats, postCats, getCatById, putCatById, deleteCatById } from '../controllers/catsController.js';
import { catPhotosRouter } from './catPhotosRouter.js';
import { enforceAuthentication } from '../middleware/middleware.js';

export const catsRouter = express.Router();

catsRouter.route(`/`)
    .get(getCats)
    .post([enforceAuthentication], postCats);

catsRouter.route(`/:cat_id`)
    .get(getCatById)
    .put([enforceAuthentication], putCatById)
    .delete([enforceAuthentication], deleteCatById);

catsRouter.use(`/:cat_id/photos`, catPhotosRouter);