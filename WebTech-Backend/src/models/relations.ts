import { User } from "./User.js";
import { Cat } from "./Cat.js";
import { Photo } from "./Photo.js";
import { Comment } from "./Comment.js";

export function initializeRelations() {
    Cat.belongsTo(User, { foreignKey: "uploader", onDelete: "SET NULL" });
    User.hasMany(Cat, { foreignKey: "uploader" });

    Photo.belongsTo(User, { foreignKey: "uploader", onDelete: "CASCADE" });
    User.hasMany(Photo, { foreignKey: "uploader" });

    Photo.belongsTo(Cat, { foreignKey: "catId", onDelete: "CASCADE" });
    Cat.hasMany(Photo, { foreignKey: "catId" });

    Cat.belongsTo(Photo, { foreignKey: "profilePicture", onDelete: "SET NULL" });
    Photo.hasOne(Cat, { foreignKey: "profilePicture" });

    Comment.belongsTo(Photo, { foreignKey: "photoId", onDelete: "CASCADE" });
    Photo.hasMany(Comment, { foreignKey: "photoId" });
    Comment.belongsTo(User, { foreignKey: "uploader", onDelete: "CASCADE" });
    User.hasMany(Comment, { foreignKey: "uploader" });
}