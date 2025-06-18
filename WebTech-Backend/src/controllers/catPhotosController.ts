import express from "express";
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
            geolocalization: req.body.geolocalization,
            uploader: req.username,
            catId: req.params.cat_id,
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
        return res.status(404).send(`Photo not found.`);
    }
    res.json(photo);
}

export function deletePhotoById(req: express.Request, res: express.Response) {
    res.send(`This will delete photo ${req.params.photo_id} from cat ${req.params.cat_id}'s photos!
        Make sure the user is authenticated!`);
}