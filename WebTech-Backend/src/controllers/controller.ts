import express from "express";
import { CatPhotoRequestParams } from "../routers/RequestParams.js";

export function deletePhotos (req: express.Request<CatPhotoRequestParams>, res: express.Response, next: any) {
    console.log(`This will delete all ${req.params.cat_id}'s photos.`);
    next();
}