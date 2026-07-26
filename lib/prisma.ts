import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const pooledDatabaseUrl = process.env.DATABASE_URL_POOLED?.trim();
const directDatabaseUrl = process.env.DATABASE_URL?.trim();
const runtimeDatabaseUrl = pooledDatabaseUrl || directDatabaseUrl;

function createPrismaClient() {
  if (!runtimeDatabaseUrl) {
    throw new Error(
      "Prisma database URL is missing. Set DATABASE_URL in the environment. DATABASE_URL_POOLED is optional."
    );
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        // In production use the pooled Neon connection (PgBouncer)
        // which keeps a warm pool and avoids cold-start latency.
        // DATABASE_URL_POOLED must include ?pgbouncer=true
        // DATABASE_URL is used for local dev and migrations (no pgbouncer).
        url: runtimeDatabaseUrl,
      },
    },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
