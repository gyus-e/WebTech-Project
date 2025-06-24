import express from "express";
import { Cat } from "../models/Cat.js";
import { Photo } from "../models/Photo.js";
import { CatRequest, PhotoRequest } from "../types/request.type.js";


export async function findCatById(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const cat = await Cat.findByPk(req.params.cat_id);
        if (!cat) {
            res.status(404).json({ error: `Cat with ID ${req.params.cat_id} not found.` });
            return;
        }
        (req as CatRequest<any>).cat = cat;
        next();
    } catch (error) {
        res.status(500).send(`Failed to fetch cat.`);
        console.error(error);
    }
}

export async function findPhotoById(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const photo = await Photo.findByPk(req.params.photo_id);
        if (!photo) {
            res.status(404).json({ error: `Photo with ID ${req.params.photo_id} not found.` });
            return;
        }
        (req as PhotoRequest<any>).photo = photo;
        next();
    } catch (error) {
        res.status(500).send(`Failed to fetch photo.`);
        console.error(error);
    }
}
