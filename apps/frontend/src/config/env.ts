import { z } from "zod";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:8080";

const nodeEnv =
  process.env.NODE_ENV ||
  process.env.VITE_ENV ||
  "development";

const envVarsSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8080"),
  VITE_API_URL: z.string().url().default("http://localhost:8080"),
  API_URL: z.string().url().default("http://localhost:8080"),
  NODE_ENV: z.string().default("development"),
});

const parseResult = envVarsSchema.safeParse({
  NEXT_PUBLIC_API_URL: apiUrl,
  VITE_API_URL: apiUrl,
  API_URL: apiUrl,
  NODE_ENV: nodeEnv,
});

if (!parseResult.success) {
  console.error(
    "❌ Invalid environment variables:",
    parseResult.error.flatten(),
  );
  throw new Error("Invalid environment variables");
}

export const env = parseResult.data;
