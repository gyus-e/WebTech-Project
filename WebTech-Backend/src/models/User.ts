import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class User extends Model {
    public username!: string;
    public password!: string;
};

export async function initializeUserModel() {
    const database = await DatabaseConnectionManager.getInstance();
    User.init(
        {
            username: { type: DataTypes.TEXT, primaryKey: true, allowNull: false, unique: true },
            password: { type: DataTypes.TEXT, allowNull: false },
        },
        {
            sequelize: database, 
            modelName: "User",
        }
    );
}