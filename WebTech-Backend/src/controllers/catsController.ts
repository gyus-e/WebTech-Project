import express from "express";
import { Cat } from "../models/Cat.js";
import { CatRequestParams } from '../types/requestParams.js';


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
    try {
        const cat = await Cat.findByPk(req.params.cat_id);
        if (!cat) {
            return res.status(404).send(`Cat not found.`);
        }
        res.json(cat);
    } catch (error) {
        res.status(500).send(`Failed to fetch cat.`);
        console.error(error);
    }
}


export async function putCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    try {
        const cat = await Cat.findByPk(req.params.cat_id);
        if (!cat) {
            return res.status(404).send(`Cat not found.`);
        }
        const name = req.body.name ?? res.status(400).json({ error: `no cat name specified` });
        if (cat.name === name) {
            return res.status(400).json({ error: `cat name is the same as before` });
        }
        await cat.save();
        res.json(cat);
    } catch (error) {
        res.status(500).send(`Failed to update cat.`);
        console.error(error);
    }
}


export async function deleteCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    try {
        const cat = await Cat.findByPk(req.params.cat_id);
        if (!cat) {
            return res.status(404).send(`Cat not found.`);
        }
        await cat.destroy();
        res.status(204).send(`Cat with ID ${req.params.cat_id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Failed to delete cat.`);
        console.error(error);
    }
}

