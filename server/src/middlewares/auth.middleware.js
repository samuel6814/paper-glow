import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req, res, next) => {
    try {
        // Retrieve the session using Better Auth
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized: Please log in." });
        }

        // Attach the user object to the request so our controllers can use it
        req.user = session.user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};