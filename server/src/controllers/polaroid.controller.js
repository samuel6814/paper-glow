import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

// POST: Upload a new Polaroid
export const uploadPolaroid = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        // Stream the memory buffer directly to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "paperglow_polaroids" },
            async (error, result) => {
                if (error) return res.status(500).json({ error: "Cloudinary upload failed" });

                // Save the new record to Neon DB
                const newPolaroid = await prisma.polaroid.create({
                    data: {
                        userId: req.user.id,
                        imageUrl: result.secure_url,
                        caption: req.body.caption || null,
                    }
                });

                res.status(201).json(newPolaroid);
            }
        );

        // Pipe the buffer to the stream
        uploadStream.end(req.file.buffer);

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Server error during upload" });
    }
};

// GET: Fetch all Polaroids for the logged-in user
export const getPolaroids = async (req, res) => {
    try {
        const polaroids = await prisma.polaroid.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(polaroids);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch polaroids" });
    }
};

// GET: Fetch a single Polaroid by ID
export const getPolaroidById = async (req, res) => {
    try {
        const polaroid = await prisma.polaroid.findUnique({
            where: { id: req.params.id }
        });
        
        if (!polaroid || polaroid.userId !== req.user.id) {
            return res.status(404).json({ error: "Polaroid not found or unauthorized" });
        }
        
        res.status(200).json(polaroid);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch polaroid" });
    }
};

// DELETE: Remove a Polaroid from DB and Cloudinary
export const deletePolaroid = async (req, res) => {
    try {
        const polaroid = await prisma.polaroid.findUnique({
            where: { id: req.params.id }
        });

        if (!polaroid || polaroid.userId !== req.user.id) {
            return res.status(404).json({ error: "Polaroid not found" });
        }

        // Extract Cloudinary public_id from the URL to delete the file
        const urlParts = polaroid.imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const publicId = `paperglow_polaroids/${fileName.split('.')[0]}`;
        
        await cloudinary.uploader.destroy(publicId);

        // Delete from Database
        await prisma.polaroid.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ message: "Polaroid deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete polaroid" });
    }
};