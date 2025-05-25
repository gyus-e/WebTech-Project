import express from 'express';
import { catsRouter } from './routers/catsRouter.js';

const app = express();
const PORT = 3000;

app.get(`/`, (req: express.Request, res: express.Response) => {
    res.send(`Welcome to WebTech's Streetcats!`);
});

app.use(`/cats`, catsRouter);

app.listen(PORT);