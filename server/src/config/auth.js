import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma.js";

export const auth = betterAuth({
    // Connect Better Auth to your Neon Postgres DB via Prisma
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    // Enable the Email & Password flow
    emailAndPassword: {
        enabled: true,
    },
    
    // Enable Google OAuth (Requires Client ID/Secret in .env)
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }
    }
});