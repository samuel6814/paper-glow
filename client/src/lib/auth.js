import { createAuthClient } from "better-auth/react";

/**
 * Dynamically pulls the Backend URL from the environment variable.
 * During development, it falls back to your local port 5000.
 * In production, Vercel will use the VITE_API_BASE you set in the dashboard.
 */
export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000"
});

export const { signIn, signUp, useSession, signOut } = authClient;