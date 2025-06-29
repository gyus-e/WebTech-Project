import DatabaseConnectionManager from './DatabaseConnectionManager.js';
import { initializeUserModel } from "./models/User.js";
import { initializeCatModel } from "./models/Cat.js";
import { initializePhotoModel } from "./models/Photo.js";
import { initializeRelations } from "./models/relations.js";
import { Sequelize } from 'sequelize';
import { initializeCommentModel } from './models/Comment.js';

export async function initializeDatabase() {
    const database = await DatabaseConnectionManager.getInstance();
    await testConnection(database);
    await initializeModels();
    return database;
}

async function initializeModels() {
    await initializeUserModel();
    await initializeCatModel();
    await initializePhotoModel();
    await initializeCommentModel();
    initializeRelations();
}

async function testConnection(database: Sequelize) {
    try {
        await database.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}