import { config } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { z } from "zod";

const findEnvPath = () => {
  let currentDir = process.cwd();

  while (true) {
    const candidate = resolve(currentDir, ".env");

    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = dirname(currentDir);

    if (parentDir === currentDir) {
      return resolve(process.cwd(), ".env");
    }

    currentDir = parentDir;
  }
};

config({
  path: findEnvPath(),
});

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z
    .string()
    .min(1)
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("ERROR: Invalid env:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
