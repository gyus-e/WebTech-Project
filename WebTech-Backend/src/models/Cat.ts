import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Cat extends Model {};

export async function initializeCatModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Cat.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
            name: { type: DataTypes.TEXT, allowNull: false, },
        },
        {
            sequelize: database, 
            modelName: "Cat",
        }
    );

    // await Cat.sync({alter: true});
    // console.log("Cats table synchronized.");
}