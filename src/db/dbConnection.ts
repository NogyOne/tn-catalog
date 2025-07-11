import { PrismaClient } from "@prisma/client";

// Global variable to hold the Prisma client instance
// This is used to avoid creating multiple instances in development mode
// and to prevent issues with prepared statements in production.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],

    //Config to avoid issues with prepared statements in production
    transactionOptions: {
      maxWait: 3000,
      timeout: 8000,
    },
  });
};

export const prisma =
  process.env.NODE_ENV === "production"
    ? createPrismaClient()
    : globalForPrisma.prisma ||
      (() => {
        const client = createPrismaClient();
        globalForPrisma.prisma = client;
        return client;
      })();

export const closePrisma = async () => {
  if (process.env.NODE_ENV === "production") {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.warn("Error cerrando conexión:", error);
    }
  }
};
