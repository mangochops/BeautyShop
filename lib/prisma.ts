// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const isServerless = process.env.NODE_ENV === "production" && process.env.VERCEL;

let prisma: PrismaClient;

if (isServerless) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({
    // adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
} else {
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma; // Default export
