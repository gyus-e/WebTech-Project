import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Photo extends Model {
    public id!: number;
    public path!: string;
    public uploader!: string;
    public catId!: number;
    public title!: string;
    public geolocation!: { type: string; coordinates: number[] } | null;
    public description!: string | null;
};

export async function initializePhotoModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Photo.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            path: { type: DataTypes.TEXT, allowNull: false, unique: true },
            uploader: { type: DataTypes.TEXT, allowNull: false },
            catId: { type: DataTypes.INTEGER, allowNull: false, },
            title: { type: DataTypes.TEXT, allowNull: false },
            // geolocation: { type: DataTypes.GEOMETRY("POINT"), allowNull: true },
            date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            description: { type: DataTypes.TEXT("long"), allowNull: true },
        },
        {
            sequelize: database,
            modelName: "Photo",
        }
    );
}