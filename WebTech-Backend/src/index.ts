import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { swaggerSpec } from './swaggerSpec.js';
import { initializeDatabase } from './database.js';
import { router } from './routes/router.js';
import { errorHandler } from './middleware/errorHandler.js';


async function main(){
    dotenv.config();
    const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const COOKIE_PARSER_SECRET: string = process.env.COOKIE_PARSER_SECRET ?? (() => {throw new Error("Cookie parser secret is not set in environment variables");})();

    const database = await initializeDatabase();
    await database.sync();

    const app = express();

    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser(COOKIE_PARSER_SECRET));
    app.use(express.json());
    app.use(cors());
    
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.use(`/`, router);

    app.use(errorHandler);

    app.listen(PORT);
}

main();