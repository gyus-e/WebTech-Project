import express from 'express';
import { getPhotos, postPhotos, getPhotoById, putPhotoById, deletePhotoById, sendPhotoById, getPhotoGeolocation, getPhotoDescription } from '../controllers/catPhotosController.js';
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
 *          404:
 *            description: Cat not found
 *       
 *    post:
 *      description: Post a new photo for a specific cat
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: title, description, geolocation, catId and photo file for the new photo
 *        required: true
 *        content:
 *          multipart/form-data:
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
 *                photo:
 *                  type: string
 *                  format: binary
 *      responses:
 *        201:
 *          description: Photo posted successfully
 *        400:
 *          description: Bad request, missing required fields
 *        403:
 *          description: Forbidden, user not authorized to create photo
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
 *       requestHeader:
 *         description: Authentication token
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer your-auth-token
 *       responses:
 *          204:
 *            description: Photo deleted successfully
 *          401:
 *            description: Unauthorized, user not authenticated
 *          403:
 *            description: Forbidden, user not authorized to delete this photo
 *          404:
 *            description: Photo not found
 *          500:
 *            description: Internal server error, failed to delete photo
*/
catPhotosRouter.route(`/:photo_id`)
    .all(findPhotoById, photoIdValidator())
    .get([validateRequest], getPhotoById)
    .put([enforceAuthentication, photoTitleValidator(), photoDescriptionValidator(), validateRequest], putPhotoById)
    .delete([enforceAuthentication, checkPhotoOwnership, validateRequest], deletePhotoById);


/**
 * @swagger
 *  /cats/{cat_id}/photos/{photo_id}/send:
 *     get:
 *       description: Send the file for a specific photo of a specific cat
 *       responses:
 *           200:
 *             description: Photo file sent successfully
 *           404:
 *             description: Photo file not found
 */
catPhotosRouter.get(`/:photo_id/send`, [findPhotoById, photoIdValidator(), validateRequest], sendPhotoById);
catPhotosRouter.get(`/:photo_id/geolocation`, [findPhotoById, photoIdValidator(), validateRequest], getPhotoGeolocation);
catPhotosRouter.get(`/:photo_id/description`, [findPhotoById, photoIdValidator(), validateRequest], getPhotoDescription);

catPhotosRouter.use(`/:photo_id/comments`, [findPhotoById, photoIdValidator()], commentsRouter);