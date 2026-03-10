import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js"; 

const router = express.Router();

// By using .use() instead of .all("/*"), we bypass the strict URL regex parser completely!
// Better Auth will securely catch /api/auth/sign-in, /api/auth/session, etc.
router.use(toNodeHandler(auth));

export default router;