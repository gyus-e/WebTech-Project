import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { router } from './routers/router.js';
import { database } from './db.js';
import './models/associations.js';

dotenv.config();
const SESSION_SECRET = process.env.SESSION_SECRET ?? (() => { throw new Error("SESSION_SECRET is not set"); })();
const app = express();
const PORT = 3000;

database.sync().then( () => {console.log("Database synchronized.")});

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET, 
    saveUninitialized: false, 
    resave: false,
}));
app.use(`/`, router);

app.listen(PORT);