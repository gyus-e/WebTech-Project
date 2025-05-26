import express from "express";
import { Cat } from "../models/Cat.js";
import { CatRequestParams } from '../types/requestParams.js';

export async function getCats(req: express.Request, res: express.Response) {
    const cats = await Cat.findAll();
    // res.render(`locals/cats.pug`, { cats });
    res.json(cats);
}

export async function postCats (req: express.Request, res: express.Response) {
    try {
        const cat = await Cat.create({
            name: req.body.name, 
            age: req.body.age,
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
        // res.render(`locals/cat_id.pug`, cat.toJSON());
        res.json(cat);
    } catch (error) {
        res.status(500).send(`Failed to fetch cat.`);
        console.error(error);
    }
}

export async function putCatById(req: express.Request<CatRequestParams>, res: express.Response) {
    res.send(`This will update ${req.params.cat_id}'s page, if it exists!\n
        Make sure the user is authenticated!
        Return a 404 if it does not exist.`);
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

