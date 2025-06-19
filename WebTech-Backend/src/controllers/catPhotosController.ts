import express from "express";
import fs from "fs";
import { Photo } from "../models/Photo.js";
import { Cat } from "../models/Cat.js";


export async function getPhotos(req: express.Request, res: express.Response) {
    const catId = req.params.cat_id;
    const cat = await Cat.findByPk(catId);
    if (!cat) {
        res.status(404).send(`Cat with ID ${catId} not found.`);
        return;
    }
    const photos = await Photo.findAll({
        where: { catId: catId }
    });
    res.json(photos);
}

export async function postPhotos(req: express.Request, res: express.Response) {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Photo file is required.' });
            return;
        }
        const photo = await Photo.create({
            title: req.body.title,
            description: req.body.description,
            geolocalization: req.body.geolocalization,
            uploader: req.username,
            catId: req.params.cat_id,
            path: req.file.path,
        });
        res.status(201).json(photo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create photo.' });
        console.error(error);
    }
}

export async function getPhotoById(req: express.Request, res: express.Response) {
    const photo = await Photo.findOne({
        where: {
            catId: req.params.cat_id,
            id: req.params.photo_id,
        }
    });
    if (!photo) {
        res.status(404).send(`Photo not found.`);
        return;
    }
    res.json(photo);
}

export async function deletePhotoById(req: express.Request, res: express.Response) {
    try {
        const photo = await Photo.findByPk(req.params.photo_id);
        if (!photo) {
            res.status(404).send(`Photo not found.`);
            return;
        }
        fs.rm(photo.path, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${photo.path}`, err);
                res.status(500).send(`Failed to delete photo file.`);
                return;
            }
            console.log(`File deleted: ${photo.path}`);
        });
        await photo.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send(`Failed to delete photo.`);
        console.error(error);
    }
}