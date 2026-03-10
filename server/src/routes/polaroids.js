import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { PrismaClient } from '@prisma/client';
import { auth } from '../lib/auth.js'; // Import your Better Auth config

const router = express.Router();
const prisma = new PrismaClient();

// Configure Cloudinary (Make sure these are in your server/.env file!)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for secure memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Only accept JPEGs, PNGs, and WebPs
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
    // 1. Check if user is authenticated via Better Auth
    const session = await auth.api.getSession({
      headers: req.headers
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // 2. Make sure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const { caption } = req.body;

    // 3. Upload the image buffer to Cloudinary safely
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'paperglow_polaroids' },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Cloudinary upload failed" });

        // 4. Save the record in the Neon Database via Prisma
        const newPolaroid = await prisma.polaroid.create({
          data: {
            imageUrl: result.secure_url,
            caption: caption || "",
            userId: session.user.id, // Tie it to the logged-in user!
          },
        });

        // 5. Send success back to React
        res.status(201).json(newPolaroid);
      }
    );

    // Push the file buffer into the stream
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;