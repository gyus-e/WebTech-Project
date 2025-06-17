import express from "express";
import { Photo } from "../models/Photo.js";

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