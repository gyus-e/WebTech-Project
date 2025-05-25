import User from "./User.js";
import Cat from "./Cat.js";
import Photo from "./Photo.js";

User.hasMany(Photo);
Cat.hasMany(Photo);
Photo.belongsTo(Cat);
Photo.hasOne(User, { foreignKey: "uploader" });