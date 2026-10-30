
import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    // Set the folder where uploaded files will be stored
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },

    // Generate a unique filename for each uploaded file
    filename: function (req, file, cb) {
        crypto.randomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }

            const uniqueName = raw.toString("hex");
            const extension = path.extname(file.originalname);

            cb(null, file.fieldname + "-" + uniqueName + extension);
        });
    }
});


export const upload = multer({
    storage: storage
});