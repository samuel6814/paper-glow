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
    // ADD THIS SECTION FOR PRODUCTION!
    advanced: {
        cookiePrefix: "paperglow",
        crossSubDomainCookie: true, // Allows cookies between Vercel and Render
    },
    trustedOrigins: [process.env.CLIENT_URL]
});