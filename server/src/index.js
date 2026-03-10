// server/index.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import polaroidRoutes from './routes/polaroid.routes.js'; // Ensure this points to the new Multer route!

dotenv.config();

const app = express();

app.set('trust proxy', 1);

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
    credentials: true // Required for Better Auth cookies
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // CRITICAL: Required for parsing text fields in FormData!

// ==========================================
// API ENDPOINTS
// ==========================================
app.use('/api/auth', authRoutes);           // Auth middleware routes
app.use('/api/polaroids', polaroidRoutes);  // Polaroid CRUD and Cloudinary Uploads

// Simple health check route (Great for testing if your server is alive in production)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'PaperGlow API is running smoothly!' });
});

// ==========================================
// SERVER INIT
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` PaperGlow Server is running on port ${PORT}`);
});