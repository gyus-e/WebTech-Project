import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import DatabaseConnectionManager from './DatabaseConnectionManager.js';
import { initializeDatabaseModels } from './initializeDatabaseModels.js';
import { router } from './routers/router.js';
import { errorHandler } from './controllers/errorHandler.js';

dotenv.config();

async function startServer(){
    const SESSION_SECRET = process.env.SESSION_SECRET ?? (() => { throw new Error("SESSION_SECRET is not set"); })();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    const database = await DatabaseConnectionManager.getInstance();
    await DatabaseConnectionManager.testConnection();
    await initializeDatabaseModels();
    await database.sync();

    const app = express();
    app.set("view engine", "pug");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session({ secret: SESSION_SECRET, saveUninitialized: false, resave: false, }));
    app.use(`/`, router);
    app.use(errorHandler);
    app.listen(PORT);
}

startServer();