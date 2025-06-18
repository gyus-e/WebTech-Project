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

export async function deletePhotoById(req: express.Request, res: express.Response) {
    try {
        const photo = await Photo.findByPk(req.params.photo_id);
        if (!photo) {
            return res.status(404).send(`Photo not found.`);
        }
        await photo.destroy();
        res.status(204).send(`Photo with ID ${req.params.photo_id} deleted successfully.`);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Failed to delete photo.`);
        console.error(error);
    }
}