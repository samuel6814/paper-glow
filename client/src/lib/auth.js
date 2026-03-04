import { createAuthClient } from "better-auth/react";

// Initialize the Better Auth client. 
// Because we set up the Vite proxy, this will automatically know to talk to "http://localhost:5000/api/auth"
export const authClient = createAuthClient();

// Export the specific hooks and functions we need across our app
export const { signIn, signUp, useSession, signOut } = authClient;