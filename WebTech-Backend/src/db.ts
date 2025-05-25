import { Sequelize } from "sequelize";

// const DB_DRIVER = process.env.DB_DRIVER ?? "sqlite";
// const DB_USER = process.env.DB_USER ?? "";
// const DB_PASS = process.env.DB_PASS ?? "";
// const DB_HOST = process.env.DB_HOST ?? "mydb.sqlite";
// const DB_PORT = process.env.DB_PORT ?? "";
// const DB_NAME = process.env.DB_NAME ?? "";

// const DB_URL = `${DB_DRIVER}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const DB_URL = `sqlite:mydb.sqlite`;

class DatabaseConnectionManager {
    private static instance: Sequelize;

    static getInstance(): Sequelize {
        if (!DatabaseConnectionManager.instance) {
            DatabaseConnectionManager.instance = new Sequelize(DB_URL);
            DatabaseConnectionManager.testConnection();
        }
        return DatabaseConnectionManager.instance;
    }
    
    static async testConnection() {
        try {
            await DatabaseConnectionManager.instance.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export const database = DatabaseConnectionManager.getInstance();

