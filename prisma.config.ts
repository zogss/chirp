import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load env files the same way Next.js does: `.env.local` takes precedence over `.env`.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
