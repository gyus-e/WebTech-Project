import express from 'express';
import { validateRequest } from '../middleware/validators.js';
import { getComments, postComments } from '../controllers/commentsController.js';
import { enforceAuthentication } from '../middleware/enforceAuthentication.js';

export const commentsRouter = express.Router({ mergeParams: true });

commentsRouter.route(`/`)
    .get([validateRequest], getComments)
    .post([enforceAuthentication, validateRequest], postComments);