import express from "express";
import fs from "fs";
import path from "path";
import { Cat } from "../models/Cat.js";
import { CatRequestParams } from '../types/requestParams.type.js';
import { CatRequest } from "../types/request.type.js";


export async function getCats(req: express.Request, res: express.Response) {
    try {
        const cats = await Cat.findAll();
        res.json(cats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cats.' });
        console.error(error);
    }
}


export async function postCats(req: express.Request, res: express.Response) {
    try {
        const cat = await Cat.create({
            name: req.body.name ?? (() => { res.status(400).json({ error: `cat name required` }) })(),
            uploader: req.username,
        });
        res.status(201).json(cat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create cat.' });
        console.error(error);
    }
}


export async function getCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    res.json((req as CatRequest<CatRequestParams>).cat!);
}


export async function putCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    try {
        const cat = (req as CatRequest<CatRequestParams>).cat!;
        const name = req.body.name
        if (!name || cat.name === name) {
            res.status(400).json({ error: `cat name could not be changed` });
            return;
        }
        cat.name = name;
        await cat.save();
        res.json(cat);
    } catch (error) {
        res.status(500).send(`Failed to update cat.`);
        console.error(error);
    }
}


export async function deleteCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    try {
        const cat = (req as CatRequest<CatRequestParams>).cat!;
        await removeCatDirectoryFromUploads(cat);
        await cat.destroy();
        res.status(204).send(`Cat with ID ${req.params.cat_id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Failed to delete cat.`);
        console.error(error);
    }
}

async function removeCatDirectoryFromUploads(cat: Cat) {
    const dirPath = path.join(`uploads`, cat.id.toString());
    if (fs.existsSync(dirPath)) {
        fs.rmdirSync(dirPath, { recursive: true });
    }
}