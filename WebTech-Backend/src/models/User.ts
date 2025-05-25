import { DataTypes, Model } from "sequelize";
import { database } from "../db.js";

export default class User extends Model {};

User.init(
    {
        username: { type: DataTypes.TEXT, primaryKey: true, allowNull: false, unique: true },
        password: { type: DataTypes.TEXT, allowNull: false },
    },
    {
        sequelize: database, modelName: "User",
    }
);

User.sync({alter: true}).then( () => {
    console.log("Users table synchronized.");
}).catch( err => {
    console.error("Synchronization error:", err.message);
});