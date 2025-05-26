import { User, initializeUserModel } from "./User.js";
import { Cat, initializeCatModel } from "./Cat.js";
import { Photo, initializePhotoModel } from "./Photo.js";

export async function initializeDatabaseModels() {
    await initializeUserModel();
    await initializeCatModel();
    await initializePhotoModel();

    User.hasMany(Photo);
    Cat.hasMany(Photo);
    Photo.belongsTo(Cat, { foreignKey: "catId", onDelete: "CASCADE" });
    Photo.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });
}