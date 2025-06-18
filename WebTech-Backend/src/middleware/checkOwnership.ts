import express from "express";
import { Photo } from "../models/Photo.js";
import { Cat } from "../models/Cat.js";


export async function checkPhotoOwnership(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.username;
    const photo = await Photo.findByPk(req.params.photo_id);
    if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
    }
    if (photo.uploader !== user) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}


export async function checkCatOwnership(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.username;
    const cat = await Cat.findByPk(req.params.cat_id);
    if (!cat) {
        return res.status(404).json({ error: "Cat not found" });
    }
    if (cat.uploader !== user) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
}