import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../config/auth.js";

const router = Router();

// Express v5 syntax for a catch-all route that passes everything to Better Auth
router.all(/(.*)/, toNodeHandler(auth));

export default router;