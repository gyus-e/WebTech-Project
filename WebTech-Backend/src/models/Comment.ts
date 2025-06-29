import { DataTypes, Model } from "sequelize";
import DatabaseConnectionManager from "../DatabaseConnectionManager.js";

export class Comment extends Model {
    public id!: number;
    public text!: string;
    public photoId!: number;
    public uploader!: string;
};

export async function initializeCommentModel() {
    const database = await DatabaseConnectionManager.getInstance();

    Comment.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
            text: { type: DataTypes.TEXT, allowNull: false, },
            photoId: { type: DataTypes.INTEGER, allowNull: false, },
            uploader: { type: DataTypes.TEXT, allowNull: false, },
            date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
        },
        {
            sequelize: database,
            modelName: "Comment",
        }
    );
}