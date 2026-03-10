import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    // Add this line so Better Auth knows where your Express server is!
    baseURL: "http://localhost:5000"
});

export const { signIn, signUp, useSession, signOut } = authClient;