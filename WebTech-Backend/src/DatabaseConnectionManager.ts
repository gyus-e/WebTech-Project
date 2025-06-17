import { Sequelize } from "sequelize";

export default class DatabaseConnectionManager {
    private static instance: Sequelize;

    public static async getInstance(): Promise<Sequelize> {
        if (!DatabaseConnectionManager.instance) {
            const DB_URL = DatabaseConnectionManager.buildURL();
            DatabaseConnectionManager.instance = new Sequelize(DB_URL);
        }
        return DatabaseConnectionManager.instance;
    }

    private static buildURL() {
        const DB_DRIVER = process.env.DB_DRIVER ?? "sqlite";
        const DB_USER = process.env.DB_USER;
        const DB_PASS = process.env.DB_PASS;
        const DB_HOST = process.env.DB_HOST;
        const DB_PORT = process.env.DB_PORT;
        const DB_NAME = process.env.DB_NAME ?? ":memory:";

        if (DB_DRIVER === "sqlite") {
            return `${DB_DRIVER}:${DB_NAME}`;
        }
        return `${DB_DRIVER}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    }
}