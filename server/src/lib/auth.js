import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    emailAndPassword: {
        enabled: true,
    },
    
    advanced: {
        cookiePrefix: "paperglow",
    },

    // ADD THIS LINE! Tell Better Auth to trust your Vite frontend
    trustedOrigins: ["http://localhost:5173"] 
});