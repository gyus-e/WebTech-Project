import express from 'express';
import { catsRouter } from './routers/catsRouter.js';
import { database } from './db.js';

const app = express();
const PORT = 3000;

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`/`, (req: express.Request, res: express.Response) => {
    res.render(`home`);
});

app.use(`/cats`, catsRouter);

database.sync().then( () => {console.log("Database synchronized.")});
app.listen(PORT);