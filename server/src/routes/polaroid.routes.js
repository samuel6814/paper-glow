import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { PrismaClient } from '@prisma/client';
import { auth } from '../lib/auth.js'; 

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for secure memory storage (5MB limit, images only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// POST /api/polaroids - Upload and save a new Polaroid
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // 1. Check Auth Session
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // 2. Validate File
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // 3. Extract text fields from the FormData (Now capturing filterName and fontFamily!)
    const { caption, subCaption, theme, filterName, fontFamily } = req.body;

    // 4. Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'paperglow_polaroids' },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Cloudinary upload failed" });
        }

        // 5. Save to Neon Database via Prisma
        try {
          const newPolaroid = await prisma.polaroid.create({
            data: {
              imageUrl: result.secure_url,
              caption: caption || "",
              subCaption: subCaption || "",
              theme: theme || "classic",
              filterName: filterName || "none", 
              fontFamily: fontFamily || "caveat", // NEW: Saving the font style!
              userId: session.user.id,
            },
          });

          // 6. Send success response!
          res.status(201).json(newPolaroid);
        } catch (dbError) {
          console.error("Database Error:", dbError);
          res.status(500).json({ error: "Failed to save to database" });
        }
      }
    );

    // Pipe the multer memory buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET /api/polaroids - Fetch all polaroids for the logged-in user
router.get('/', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return res.status(401).json({ error: "Unauthorized" });

    const polaroids = await prisma.polaroid.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(polaroids);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch polaroids" });
  }
});

// ==========================================
// PUT /api/polaroids/:id - Update a Polaroid
// ==========================================
router.put('/:id', async (req, res) => {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session || !session.user) return res.status(401).json({ error: "Unauthorized" });
  
      const { id } = req.params;
      
      // Extract fontFamily here too, so they can edit it in the gallery!
      const { caption, subCaption, theme, filterName, fontFamily } = req.body;
  
      // 1. Security Check: Ensure the polaroid exists and belongs to the logged-in user
      const existing = await prisma.polaroid.findUnique({ where: { id } });
      if (!existing || existing.userId !== session.user.id) {
        return res.status(403).json({ error: "Forbidden. You don't own this photo." });
      }
  
      // 2. Update the record
      const updated = await prisma.polaroid.update({
        where: { id },
        data: { caption, subCaption, theme, filterName, fontFamily } // Applied here
      });
  
      res.json(updated);
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ error: "Failed to update polaroid" });
    }
});
  
// ==========================================
// DELETE /api/polaroids/:id - Delete a Polaroid
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    // 1. Security Check: Ensure the polaroid exists and belongs to the logged-in user
    const existing = await prisma.polaroid.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return res.status(403).json({ error: "Forbidden. You don't own this photo." });
    }

    // 2. Delete the record
    await prisma.polaroid.delete({
      where: { id }
    });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete polaroid" });
  }
});

export default router;