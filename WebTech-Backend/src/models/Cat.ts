import { DataTypes, Model } from "sequelize";
import { database } from "../db.js";

export default class Cat extends Model {};

Cat.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
        name: { type: DataTypes.TEXT, allowNull: false, },
    },
    {
        sequelize: database, modelName: "Cat",
    }
);

Cat.sync({alter: true}).then( () => {
    console.log("Cats table synchronized.");
}).catch( err => {
    console.error("Synchronization error:", err.message);
});