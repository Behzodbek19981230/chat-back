import multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars"); // papka yo‘li
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // .jpg yoki .png
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

export const uploadAvatar = multer({storage});


const storagemedia = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/media");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${ext}`;
        cb(null, uniqueName);
    }
});

export const uploadMedia = multer({storagemedia});