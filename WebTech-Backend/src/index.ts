import express from 'express';
import { router } from './routers/router.js';
import { database } from './db.js';
import './models/associations.js';

const app = express();
const PORT = 3000;

database.sync().then( () => {console.log("Database synchronized.")});

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/`, router);

app.listen(PORT);