import express from 'express';
import { postLogin, postSignup } from '../controllers/authController.js';

export const authRouter = express.Router();

/**
 * @swagger
 *  /auth/login:
 *    post:
 *      description: Authenticate user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: user credentials to authenticate
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                usr:
 *                  type: string
 *                  example: Kyle
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */
authRouter.route(`/login`)
    .post(postLogin);

/**
 * @swagger
 *  /auth/signup:
 *    post:
 *      description: Register user
 *      produces:
 *        - application/json
 *      requestBody:
 *        description: user credentials to register
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                usr:
 *                  type: string
 *                  example: Kyle
 *                pwd:
 *                  type: string
 *                  example: p4ssw0rd
 *      responses:
 *        200:
 *          description: User authenticated
 *        401:
 *          description: Invalid credentials
 */
authRouter.route(`/signup`)
    .post(postSignup);