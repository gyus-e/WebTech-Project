import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Photo extends Model {
    public id!: number;
    public path!: string;
    public uploader!: string;
    public catId!: number;
    public title!: string;
    public description!: string | null;
    public geolocalization!: { type: string; coordinates: number[] } | null; // Assuming POINT type with coordinates
    public date!: Date;
};

export async function initializePhotoModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Photo.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            path: { type: DataTypes.TEXT, allowNull: true, unique: true },
            uploader: { type: DataTypes.TEXT, allowNull: false },
            catId: { type: DataTypes.INTEGER, allowNull: false, },
            title: { type: DataTypes.TEXT, allowNull: true },
            description: { type: DataTypes.TEXT("long"), allowNull: true },
            geolocalization: { type: DataTypes.GEOMETRY("POINT"), allowNull: true },
            date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        },
        {
            sequelize: database,
            modelName: "Photo",
            hooks: {
                afterCreate: async (photo: Photo) => {
                    photo.path = `/photos/${photo.catId}/${photo.id}`;
                    await photo.save();
                }
            }
        }
    );
}