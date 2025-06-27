import express from 'express';
import { Photo } from '../models/Photo.js';
import { ErrorsJson } from "../ErrorsJson.js";

export async function getPhotos(req: express.Request, res: express.Response) {
    try {
        const photos = await Photo.findAll();
        res.json(photos);
    } catch (error) {
        res.status(500).json(ErrorsJson.fromMessage('Failed to fetch photos.'));
        console.error(error);
    }
}