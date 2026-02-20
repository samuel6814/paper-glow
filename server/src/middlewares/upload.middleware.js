import multer from "multer";

// Hold the file in memory instead of saving to the local disk
const storage = multer.memoryStorage();

// Set a 5MB file size limit to prevent abuse
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});