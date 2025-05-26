import { initializeUserModel } from "./models/User.js";
import { initializeCatModel } from "./models/Cat.js";
import { initializePhotoModel } from "./models/Photo.js";
import { initializeRelations } from "./models/relations.js";

export async function initializeDatabaseModels() {
    await initializeUserModel();
    await initializeCatModel();
    await initializePhotoModel();
    initializeRelations();
}