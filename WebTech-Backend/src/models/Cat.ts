import { DataTypes, Model } from "sequelize";
import { database } from "../db.js";

export default class Cat extends Model {}

Cat.init(
    {
        name: { type: DataTypes.TEXT, allowNull: false },
        age: { type: DataTypes.INTEGER, defaultValue: 0 },
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
    },
    {
        sequelize: database, modelName: "Cat"
    }
);

Cat.sync({alter: true}).then( () => {
    console.log("Users table synchronized.")
}).catch( err => {
    console.error("Synchronization error:", err.message)
});