import { User } from "./User.js";
import { Cat } from "./Cat.js";
import { Photo } from "./Photo.js";

export function initializeRelations() {
    Cat.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });
    User.hasMany(Cat, { foreignKey: "uploader" });

    Photo.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });
    User.hasMany(Photo, { foreignKey: "uploader" });

    Photo.belongsTo(Cat, { foreignKey: "catId", onDelete: "CASCADE" });
    Cat.hasMany(Photo, { foreignKey: "catId" });
}