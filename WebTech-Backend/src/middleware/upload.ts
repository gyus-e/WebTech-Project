import multer from "multer";
import fs from 'fs';
import path from 'path';
import express from "express";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirName = path.join(`uploads/${req.params.cat_id}/`);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }
        cb(null, dirName);
    },
    filename: function (req: express.Request, file, cb) {
        const filename = `${req.username}-${Date.now()}.png`;
        cb(null, filename);
    }
})

const upload = multer({storage: storage});

export const uploadSinglePhoto = upload.single('photo');