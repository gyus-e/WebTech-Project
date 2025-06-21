import express from "express";
import { body, param, validationResult } from "express-validator";

export const usrValidator = () => body('usr').trim().notEmpty().isEmail().escape();
export const pwdValidator = () => body('pwd').trim().notEmpty().isLength({ min: 8, max: 32 }).escape();

export const catNameValidator = () => body('name').trim().notEmpty().escape();

export const photoTitleValidator = () => body('title').trim().notEmpty().escape();
export const photoDescriptionValidator = () => body('description').trim().optional().escape();
export const photoGeolocalizationValidator = () => body('geolocalization').trim().notEmpty().escape(); //TODO: isLatLong

export const catIdValidator = () => param('cat_id').trim().notEmpty().isInt().escape();
export const photoIdValidator = () => param('photo_id').trim().notEmpty().isInt().escape();

export function validateRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
}

export function reqHasFile(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.file) {
        res.status(400).json({ error: 'Photo file is required.' });
        return;
    }
    next();
}