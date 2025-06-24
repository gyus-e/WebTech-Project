import express from 'express';
import { getCats, postCats, getCatById, putCatById, deleteCatById } from '../controllers/catsController.js';
import { catPhotosRouter } from './catPhotosRouter.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';
import { checkCatOwnership } from '../middleware/checkOwnership.js';
import { catNameValidator, catIdValidator, validateRequest, findCatById } from '../middleware/validators.js';

export const catsRouter = express.Router();

catsRouter.route(`/`)
    .get(getCats)
    .post([enforceAuthentication, catNameValidator(), validateRequest], postCats);

catsRouter.route(`/:cat_id`)
    .all(catIdValidator(), findCatById)
    .get([validateRequest], getCatById)
    .put([enforceAuthentication, checkCatOwnership, catNameValidator(), validateRequest], putCatById)
    .delete([enforceAuthentication, checkCatOwnership, validateRequest], deleteCatById);

catsRouter.use(`/:cat_id/photos`, [catIdValidator(), findCatById], catPhotosRouter);