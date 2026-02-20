import { Router } from "express";
import { uploadPolaroid, getPolaroids, getPolaroidById, deletePolaroid } from "../controllers/polaroid.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes below this line with the auth middleware
router.use(requireAuth);

router.get("/", getPolaroids);
router.get("/:id", getPolaroidById);
// Use Multer middleware expecting a form field named 'image'
router.post("/", upload.single("image"), uploadPolaroid); 
router.delete("/:id", deletePolaroid);

export default router;