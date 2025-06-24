import express from 'express';
import { Photo } from '../models/Photo.js';

export async function getPhotos(req: express.Request, res: express.Response) {
    try {
        const photos = await Photo.findAll();
        res.json(photos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch photos.' });
        console.error(error);
    }
}