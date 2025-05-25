import express from 'express';
import { CatPhotoRequestParams } from '../controllers/requestParams.js';

export const catPhotosRouter = express.Router({ mergeParams: true });

catPhotosRouter.route(`/`)
    .get((req: express.Request<CatPhotoRequestParams>, res) => {
        res.send(`This will show a list of all photos of ${req.params.cat_id}!`);
    })
    .post((req: express.Request<CatPhotoRequestParams>, res) => {
        res.send(`This will add a new photo to ${req.params.cat_id}'s photos!
            Make sure the user is authenticated!`);
    });

catPhotosRouter.route(`/:photo_id`)
    .get((req: express.Request<CatPhotoRequestParams>, res) => {
        res.json(req.params);
    })
    .delete((req: express.Request<CatPhotoRequestParams>, res) => {
        res.send(`This will delete ${req.params.photo_id} from ${req.params.cat_id}'s photos!
            Make sure the user is authenticated!`);
    })
