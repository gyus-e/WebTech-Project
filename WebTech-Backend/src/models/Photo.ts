import { DataTypes, Model } from "sequelize";
import { database } from "../db.js";

export default class Photo extends Model {};

Photo.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        catID: { type: DataTypes.INTEGER, allowNull: false },
        uploader: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.TEXT, allowNull: false },
        image: { type: DataTypes.BLOB("long"), allowNull: false },
        description: { type: DataTypes.TEXT("long"), allowNull: true },
        geolocalization: { type: DataTypes.GEOMETRY("POINT"), allowNull: true },
        date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
        sequelize: database, 
        modelName: "Photo",
    }
);

Photo.sync({alter: true}).then( () => {
    console.log("Photos table synchronized.");
}).catch( err => {
    console.error("Synchronization error:", err.message);
});