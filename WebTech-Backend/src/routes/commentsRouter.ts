import express from 'express';
import { validateRequest } from '../middleware/validators.js';
import { deleteComment, getComments, postComments } from '../controllers/commentsController.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';

export const commentsRouter = express.Router({ mergeParams: true });

/**
 * @swagger
 *  /cats/{cat_id}/photos/{photo_id}/comments:
 *     get:
 *       description: Get all comments of a photo
 *       produces:
 *         - application/json
 *       responses:
 *          200:
 *             description: List of comments for the specified photo
 *          404:
 *            description: Photo not found
 *       
 *    post:
 *      description: Post a new comment for a specific cat photo
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: text of the comment and id of the photo it relates to
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                text:
 *                  type: string
 *                  example: What a cute cat
 *      responses:
 *        201:
 *          description: Comment posted successfully
 *        400:
 *          description: Bad request, missing required fields
 *        401:
 *          description: Unauthorized, user not logged in
 *        500:
 *          description: Internal server error, failed to create comment
 */
commentsRouter.route(`/`)
    .get([validateRequest], getComments)
    .post([enforceAuthentication, validateRequest], postComments);


//TODO: PUT COMMENT
commentsRouter.route(`/:comment_id`)
    .delete([enforceAuthentication, validateRequest], deleteComment);