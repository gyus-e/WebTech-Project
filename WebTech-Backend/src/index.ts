import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import DatabaseConnectionManager from './DatabaseConnectionManager.js';
import { initDB } from './models/initDB.js';
import { router } from './routers/router.js';

dotenv.config();
const SESSION_SECRET = process.env.SESSION_SECRET ?? (() => { throw new Error("SESSION_SECRET is not set"); })();
const PORT = 3000;

async function startServer(){
    const database = await DatabaseConnectionManager.getInstance();
    await DatabaseConnectionManager.testConnection();
    await initDB();
    await database.sync();

    const app = express();
    app.set("view engine", "pug");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({ secret: SESSION_SECRET, saveUninitialized: false, resave: false, }));
    app.use(`/`, router);
    app.listen(PORT);
}

startServer();