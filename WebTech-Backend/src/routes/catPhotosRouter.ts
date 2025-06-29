import express from 'express';
import { getPhotos, postPhotos, getPhotoById, deletePhotoById, sendPhotoById } from '../controllers/catPhotosController.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';
import { checkPhotoOwnership } from '../middleware/checkOwnership.js';
import { uploadSinglePhoto } from '../middleware/upload.js';
import { photoDescriptionValidator, photoGeolocalizationValidator, reqHasFile, photoIdValidator, photoTitleValidator, validateRequest } from '../middleware/validators.js';
import { findPhotoById } from '../middleware/fetchers.js';
import { commentsRouter } from './commentsRouter.js';

export const catPhotosRouter = express.Router({ mergeParams: true });


/**
 * @swagger
 *  /cats/{cat_id}/photos:
 *     get:
 *       description: Get all photos of a specific cat
 *       produces:
 *         - application/json
 *       responses:
 *          200:
 *             description: List of photos for the specified cat
 *       
 *    post:
 *      description: Post a new photo for a specific cat
 *      produces:
 *        - application/json
 *   
 *      requestBody:
 *        description: title, description, and geolocation of the photo
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  example: My Cat
 *                description:
 *                  type: string
 *                  example: This is a photo of my cat.
 *                geolocation:
 *                  type: string
 *                  example: 37.7749,-122.4194
 *      responses:
 *        201:
 *          description: Photo posted successfully
 *        400:
 *          description: Bad request, missing required fields
 *        401:
 *          description: Forbidden, user not authenticated
 *        500:
 *          description: Internal server error, failed to create photo
 */
catPhotosRouter.route(`/`)
    .get(getPhotos)
    .post([enforceAuthentication, uploadSinglePhoto, reqHasFile, photoTitleValidator(), photoDescriptionValidator(), photoGeolocalizationValidator(), validateRequest], postPhotos);


/**
 * @swagger
 *  /cats/{cat_id}/photos/{photo_id}:
 *     get:
 *       description: Get specific photo of a specific cat
 *       produces:
 *         - application/json
 *       responses:
 *           200:
 *             description: Photo details for the specified cat
 *           404:
 *             description: Photo not found
 *     delete:
 *       description: Delete specific photo of a specific cat
 *       produces:
 *         - application/json
 *       requestHeader:
 *         description: Authentication token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your-auth-token
 *       requestBody:
 *       responses:
 */
catPhotosRouter.route(`/:photo_id`)
    .all(findPhotoById, photoIdValidator())
    .get([validateRequest], getPhotoById)
    .delete([enforceAuthentication, checkPhotoOwnership, validateRequest], deletePhotoById);

catPhotosRouter.get(`/:photo_id/send`, [findPhotoById, photoIdValidator(), validateRequest], sendPhotoById);

catPhotosRouter.use(`/:photo_id/comments`, [findPhotoById, photoIdValidator()], commentsRouter);