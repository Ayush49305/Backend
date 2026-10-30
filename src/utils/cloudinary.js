import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Temporary file cleanup failed:", err.message);
        });

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);

        fs.unlink(localFilePath, (err) => {
            if (err) console.error("Temporary file cleanup failed:", err.message);
        });

        return null;
    }
};

export { uploadOnCloudinary };