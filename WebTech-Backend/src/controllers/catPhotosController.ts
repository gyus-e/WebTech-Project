import express from "express";
import { CatPhotoRequestParams } from '../types/requestParams.js';

export function getPhotos(req: express.Request<CatPhotoRequestParams>, res: express.Response) {
    res.send(`This will show a list of all photos of ${req.params.cat_id}!`);
}

export function postPhotos(req: express.Request<CatPhotoRequestParams>, res: express.Response) {
    res.send(`This will add a new photo to ${req.params.cat_id}'s photos!
        Make sure the user is authenticated!`);
}

export function getPhotoById(req: express.Request<CatPhotoRequestParams>, res: express.Response) {
    res.json(req.params);
}

export function deletePhotoById(req: express.Request<CatPhotoRequestParams>, res: express.Response) {
    res.send(`This will delete ${req.params.photo_id} from ${req.params.cat_id}'s photos!
        Make sure the user is authenticated!`);
}