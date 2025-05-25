import express from 'express';
import Cat from '../models/Cat.js';
import { catPhotosRouter } from './catPhotosRouter.js';
import { CatPhotoRequestParams, CatRequestParams } from './RequestParams.js';

export const catsRouter = express.Router();

let deletePhotos = function(req: express.Request<CatPhotoRequestParams>, res: express.Response, next: any) {
    console.log(`This will delete all ${req.params.cat_id}'s photos.`);
    next();
}

catsRouter.route(`/`)
    .get((req: express.Request, res: express.Response) => {
        res.send(`This will show a list of all cats!`);
    })
    .post((req: express.Request, res: express.Response) => {
        let cat = new Cat(`temp`);
        
        res.send(`This will add a new cat to the database!\n
            Make sure the user is authenticated!`);
    })

catsRouter.route(`/:cat_id`)
    .get((req: express.Request<CatRequestParams>, res: express.Response) => {
        res.send(`This will show ${req.params.cat_id}'s page, if it exists!
            Return a 404 if it does not exist.`);
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