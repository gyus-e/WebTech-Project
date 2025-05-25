import express from 'express';
import { catsRouter } from './routers/catsRouter.js';

const app = express();
const PORT = 3000;

app.set("view engine", "pug");

app.get(`/`, (req: express.Request, res: express.Response) => {
    res.render(`home`);
});

app.use(`/cats`, catsRouter);

app.listen(PORT);