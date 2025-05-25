import { Sequelize } from "sequelize";

class DatabaseConnectionManager {
    private static instance: Sequelize;

    static getInstance(): Sequelize {
        if (!DatabaseConnectionManager.instance) {
            DatabaseConnectionManager.instance = new Sequelize(`sqlite:mydb.sqlite`);
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

