import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { swaggerSpec } from './swaggerSpec.js';
import { initializeDatabase } from './database.js';
import { router } from './routes/router.js';
import { errorHandler } from './middleware/errorHandler.js';

async function main(){
    dotenv.config();
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

    const database = await initializeDatabase();
    await database.sync();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.use(`/`, router);

    app.use(errorHandler);

    app.listen(PORT);
}

main();