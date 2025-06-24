import express from "express";
import fs from "fs";
import { Photo } from "../models/Photo.js";

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
        res.status(201).json(photo);
    } catch (error) {
        if (fs.existsSync(req.file!.path)) {
            fs.unlinkSync(req.file!.path);
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create photo.' });
    }
}

export async function getPhotoById(req: express.Request, res: express.Response) {
    const photo = await Photo.findByPk(req.params.photo_id);
    if (!photo) {
        res.status(404).send(`Photo not found.`);
        return;
    }
    res.json(photo);
}

// export async function downloadPhotoById()(req: express.Request, res: express.Response) {
//     const photo = await Photo.findByPk(req.params.photo_id);
//     if (!photo) {
//         res.status(404).send(`Photo not found.`);
//         return;
//     }
//     const filePath = photo.path;
//     if (!fs.existsSync(filePath)) {
//         res.status(404).send(`File not found.`);
//         return;
//     }
//     res.sendFile(filePath, { root: process.cwd() });
// }

export async function deletePhotoById(req: express.Request, res: express.Response) {
    try {
        const photo = await Photo.findByPk(req.params.photo_id);
        if (!photo) {
            res.status(404).send(`Photo not found.`);
            return;
        }
        await removePhotoFromUploads(photo);
        await photo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({error: `Failed to delete photo.`});
        console.error(error);
    }
}

async function removePhotoFromUploads(photo: Photo) {
    const filePath = photo.path;
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}