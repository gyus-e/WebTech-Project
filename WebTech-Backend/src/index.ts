import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import cookieParser from 'cookie-parser';
// import session from 'express-session';
import DatabaseConnectionManager from './DatabaseConnectionManager.js';
import { initializeDatabaseModels } from './initializeDatabaseModels.js';
import { router } from './routers/router.js';
import { errorHandler } from './controllers/errorHandler.js';

dotenv.config();

async function startServer(){
    // const SESSION_SECRET = process.env.SESSION_SECRET ?? (() => { throw new Error("SESSION_SECRET is not set"); })();
    
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    const swaggerSpec = swaggerJSDoc({
        definition: {
            openapi: '3.1.0',
            info: {
                title: 'WebTech Backend API',
                version: '1.0.0',
            }
        },
    });

    const database = await DatabaseConnectionManager.getInstance();
    await DatabaseConnectionManager.testConnection();
    await initializeDatabaseModels();
    await database.sync();

    const app = express();

    // app.set("view engine", "pug");

    //middleware
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    // app.use(session({ secret: SESSION_SECRET, saveUninitialized: false, resave: false, }));
    app.use(errorHandler);

    //routers
    app.use(`/`, router);

    app.listen(PORT);
}

startServer();