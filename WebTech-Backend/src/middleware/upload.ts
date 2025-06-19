import multer from "multer";
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirName = path.join(__dirname, `uploads/${req.params.cat_id}/`);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true });
        }
        cb(null, dirName);
    },
    filename: function (req, file, cb) {
        const filename = `${req.params.photo_id}`;
        cb(null, filename);
    }
})

const upload = multer({storage: storage});

export const uploadSinglePhoto = upload.single('photo');