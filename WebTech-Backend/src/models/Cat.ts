import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Cat extends Model {
    public id!: number;
    public name!: string;
    public uploader!: string;
    public profilePicture!: number | null;
};

export async function initializeCatModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Cat.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
            name: { type: DataTypes.TEXT, allowNull: false, },
            uploader: { type: DataTypes.TEXT, allowNull: false, },
            profilePicture: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null, },
        },
        {
            sequelize: database,
            modelName: "Cat",
        }
    );
}