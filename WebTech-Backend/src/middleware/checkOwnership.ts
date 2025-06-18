import express from "express";
import { Photo } from "../models/Photo.js";
import { Cat } from "../models/Cat.js";


type UploadedItem = Photo | Cat;


function checkOwnership(item: UploadedItem | null) {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user = req.username;
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        if (item.uploader !== user) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    }
}


export async function checkPhotoOwnership(req: express.Request, res: express.Response, next: express.NextFunction) {
    const photo = await Photo.findByPk(req.params.photo_id)
    checkOwnership(photo)(req, res, next);
}


export async function checkCatOwnership(req: express.Request, res: express.Response, next: express.NextFunction) {
    const cat = await Cat.findByPk(req.params.cat_id)
    checkOwnership(cat)(req, res, next);
}
