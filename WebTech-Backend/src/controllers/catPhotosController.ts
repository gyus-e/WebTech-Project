import express from "express";
import fs from "fs";
import { Cat } from "../models/Cat.js";
import { Photo } from "../models/Photo.js";
import { PhotoRequest } from "../types/request.type.js";
import { CatPhotoRequestParams } from "../types/requestParams.type.js";
import { ErrorsJson } from "../ErrorsJson.js";

export async function getPhotos(req: express.Request, res: express.Response) {
    const photos = await Photo.findAll({
        where: { catId: req.params.cat_id }
    });
    res.json(photos);
}

export async function postPhotos(req: express.Request, res: express.Response) {
    try {
        const photo = await Photo.create({
            title: req.body.title,
            description: req.body.description,
            geolocation: req.body.geolocation,
            uploader: req.username,
            catId: req.params.cat_id,
            path: req.file!.path,
        });

        let cat = (req as any).cat as Cat;
        if (cat.profilePicture === null) {
            cat.profilePicture = photo.id;
            await cat.save();
        }

        res.status(201).json(photo);
    } catch (error) {
        if (fs.existsSync(req.file!.path)) {
            fs.unlinkSync(req.file!.path);
        }
        console.error(error);
        res.status(500).json(ErrorsJson.fromMessage('Failed to create photo.'));
    }
}

export async function getPhotoById(req: express.Request, res: express.Response) {
    const photo = (req as PhotoRequest<any>).photo!;
    res.json(photo);
}

export async function sendPhotoById(req: express.Request, res: express.Response) {
    const photo = (req as PhotoRequest<any>).photo!;
    const filePath = photo.path;
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        console.log(`Deleting the photo with ID ${req.params.photo_id} from the database.`);
        await photo.destroy();
        res.status(404).json(ErrorsJson.fromMessage(`File not found.`));
        return;
    }
    res.sendFile(filePath, { root: process.cwd() });
}

export async function deletePhotoById(req: express.Request, res: express.Response) {
    try {
        const photo = await Photo.findByPk(req.params.photo_id);
        if (!photo) {
            res.status(404).json(ErrorsJson.fromMessage(`Photo not found.`));
            return;
        }
        await removePhotoFromUploads(photo);
        await photo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json(ErrorsJson.fromMessage(`Failed to delete photo.`));
        console.error(error);
    }
}

export async function getPhotoGeolocation(req: express.Request, res: express.Response) {
    const photo = (req as PhotoRequest<any>).photo!;
    if (!photo.geolocation) {
        res.status(404).json(ErrorsJson.fromMessage(`Geolocation not found for this photo.`));
        return;
    }
    res.json(photo.geolocation);
}

export async function getPhotoDescription(req: express.Request, res: express.Response) {
    const photo = (req as PhotoRequest<any>).photo!;
    if (!photo.description) {
        res.status(404).json(ErrorsJson.fromMessage(`Description not found for this photo.`));
        return;
    }
    res.json(photo.description);
}

async function removePhotoFromUploads(photo: Photo) {
    const filePath = photo.path;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}