// ... (other imports)
import { PrismaClient } from "@prisma/client";
import { Environments } from "@/constants/enums";

const isDev = process.env.NODE_ENV !== Environments.PROD;

let db: PrismaClient;

if (isDev) {
  // Use global in development to avoid hot-reload issues
  const globalForPrisma = global as unknown as { prisma?: PrismaClient };
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn", "info"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      errorFormat: "pretty",
    });
  }
  db = globalForPrisma.prisma;
} else {
  // Always create a new instance in production/build
  db = new PrismaClient({
    log: ["query", "error", "warn", "info"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    errorFormat: "pretty",
  });
}

// Log the actual URLs being used (CAREFUL WITH SENSITIVE DATA IN PROD LOGS!)
console.log("--- DATABASE CONNECTION DEBUG ---");
console.log("DATABASE_URL is defined:", !!process.env.DATABASE_URL);
console.log("DIRECT_URL is defined:", !!process.env.DIRECT_URL);
// Only log partial URL for security, or in a controlled dev environment
if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL host:", new URL(process.env.DATABASE_URL).host);
  console.log("DATABASE_URL port:", new URL(process.env.DATABASE_URL).port);
}
if (process.env.DIRECT_URL) {
  console.log("DIRECT_URL host:", new URL(process.env.DIRECT_URL).host);
  console.log("DIRECT_URL port:", new URL(process.env.DIRECT_URL).port);
}
console.log("Node Environment:", process.env.NODE_ENV);
console.log("--- END DEBUG ---");

// Only connect in dev, in prod Next.js will manage connection lifecycle
if (isDev) {
  db.$connect()
    .then(() => {
      console.log("🟢 Successfully connected to database using DATABASE_URL");
    })
    .catch((error) => {
      console.error(
        "🔴 Failed to connect to database using DATABASE_URL. Error details:"
      );
      console.error(error); // Log the full error object
      console.error("Error message:", error.message);
      console.error("Error code:", error.code); // Look for codes like P1001 (Can't reach database server)
      console.error("Error meta:", error.meta);
      console.error("Error name:", error.name);
      console.error("Error stack:", error.stack);
      // Optionally, rethrow the error if you want to stop the app
      // throw error;
    });
}

export { db };
