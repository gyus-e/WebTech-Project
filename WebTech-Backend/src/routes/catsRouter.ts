import express from 'express';
import { getCats, postCats, getCatById, putCatById, deleteCatById, getCatProfilePicture } from '../controllers/catsController.js';
import { catPhotosRouter } from './catPhotosRouter.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';
import { checkCatOwnership } from '../middleware/checkOwnership.js';
import { catNameValidator, catIdValidator, validateRequest } from '../middleware/validators.js';
import { findCatById } from "../middleware/fetchers.js";

export const catsRouter = express.Router();

/**
 * @swagger
 *  /cats:
 *     get:
 *       description: Get list of all cats
 *       produces:
 *         - application/json
 *       responses:
 *          200:
 *             description: List of the cats
 *          404:
 *            description: No cats found
 *       
 *    post:
 *      description: Post a new cat
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: name of the cat to upload
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Tom
 *      responses:
 *        201:
 *          description: Cat posted successfully
 *        400:
 *          description: Bad request, missing required fields
 *        403:
 *          description: Forbidden, user not authorized to create cat
 *        500:
 *          description: Internal server error, failed to create cat
 */
catsRouter.route(`/`)
    .get(getCats)
    .post([enforceAuthentication, catNameValidator(), validateRequest], postCats);

catsRouter.route(`/:cat_id`)
    .all(catIdValidator(), findCatById)
    .get([validateRequest], getCatById)
    .put([enforceAuthentication, checkCatOwnership, catNameValidator(), validateRequest], putCatById)
    .delete([enforceAuthentication, checkCatOwnership, validateRequest], deleteCatById);


catsRouter.get(`/:cat_id/profile-picture`, [catIdValidator(), findCatById, validateRequest], getCatProfilePicture);

catsRouter.use(`/:cat_id/photos`, [catIdValidator(), findCatById], catPhotosRouter);