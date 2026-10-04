import { defineConfig } from "prisma/config";

/**
 * Prisma config — replaces the deprecated `package.json#prisma` block (removed in Prisma 7).
 *
 * When this file is present the Prisma CLI no longer auto-loads `.env`, so load it explicitly
 * (Node >= 20.12). A missing `.env` is not an error — CI and other environments pass the values
 * directly as environment variables.
 */
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env is optional: variables may already be provided by the environment.
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
