import { User } from "./User.js";
import { Cat } from "./Cat.js";
import { Photo } from "./Photo.js";

export function initializeRelations() {
    User.hasMany(Cat);
    Cat.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });

    User.hasMany(Photo);
    Photo.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });

    Cat.hasMany(Photo);
    Photo.belongsTo(Cat, { foreignKey: "catId", onDelete: "CASCADE" });
}