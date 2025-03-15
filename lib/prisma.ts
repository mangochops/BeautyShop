import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless"; // For Neon WebSocket support
import { PrismaNeon } from "@prisma/adapter-neon"; // Neon adapter for Prisma

// Type the global object to include prisma
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if we're in a serverless environment (e.g., Vercel) and use Neon adapter
const isServerless = process.env.NODE_ENV === "production" && process.env.VERCEL; // Adjust based on your env

let prisma: PrismaClient;

if (isServerless) {
  // Use Neon WebSocket adapter for serverless environments
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
} else {
  // Standard PrismaClient for local dev or non-serverless prod
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

// Store in global scope for non-production to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
