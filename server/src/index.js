import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import polaroidRoutes from './routes/polaroid.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
    credentials: true // Required for Better Auth cookies
}));
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);           // Auth middleware routes
app.use('/api/polaroids', polaroidRoutes);  // Polaroid CRUD operations

// Server Init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`📸 PaperGlow Server is running on port ${PORT}`);
});