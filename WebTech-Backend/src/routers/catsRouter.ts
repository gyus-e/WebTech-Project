import express from 'express';
import Cat from '../models/Cat.js';
import { deletePhotos } from '../middlewares/middlewares.js';
import { catPhotosRouter } from './catPhotosRouter.js';
import { CatRequestParams } from './requestParams.js';

export const catsRouter = express.Router();

catsRouter.route(`/`)
    .get(async (req: express.Request, res: express.Response) => {
        const cats = await Cat.findAll();
        res.render(`locals/cats.pug`, { cats });
    })
    .post(async (req: express.Request, res: express.Response) => {
        //TODO: Ensure that the user is authenticated
        try {
            const cat = await Cat.create({
                name: req.body.name, 
                age: req.body.age
            });
            res.status(201).json(cat);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create cat.' });
            console.error(error);
        }
    })

catsRouter.route(`/:cat_id`)
    .get(async (req: express.Request<CatRequestParams>, res: express.Response) => {
        try {
            const cat = await Cat.findByPk(req.params.cat_id);
            if (!cat) {
                return res.status(404).send(`Cat not found.`);
            }
            res.render(`locals/cat_id.pug`, cat.toJSON());
            //TODO: Single Page Web Application: don't render html, just send a JSON response
        } catch (error) {
            res.status(500).send(`Failed to fetch cat.`);
            console.error(error);
        }
    })
    .put((req: express.Request<CatRequestParams>, res: express.Response) => {
        res.send(`This will update ${req.params.cat_id}'s page, if it exists!\n
            Make sure the user is authenticated!
            Return a 404 if it does not exist.`);
    })
    .delete([deletePhotos], (req: express.Request<CatRequestParams>, res: express.Response) => {
        res.send(`And it will also delete ${req.params.cat_id}'s page!\n
            Make sure the user is authenticated!
            Return a 404 if it does not exist.`);
    });

catsRouter.use(`/:cat_id/photos`, catPhotosRouter);