import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Photo extends Model {
    public id!: number;
    public title!: string;
    public image!: Buffer; // Using Buffer for BLOB data
    public description!: string | null;
    public geolocalization!: { type: string; coordinates: number[] } | null; // Assuming POINT type with coordinates
    public date!: Date;
};

export async function initializePhotoModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Photo.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
}