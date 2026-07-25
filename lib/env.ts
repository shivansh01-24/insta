import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters long"),
  ENCRYPTION_KEY: z.string().min(16, "ENCRYPTION_KEY must be at least 16 characters long"),
  META_APP_ID: z.string().min(1, "META_APP_ID is required"),
  META_APP_SECRET: z.string().min(1, "META_APP_SECRET is required"),
  META_REDIRECT_URI: z.string().url("META_REDIRECT_URI must be a valid URL"),
  META_WEBHOOK_VERIFY_TOKEN: z.string().min(1, "META_WEBHOOK_VERIFY_TOKEN is required"),
  META_GRAPH_API_VERSION: z.string().default("v23.0"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    META_REDIRECT_URI: process.env.META_REDIRECT_URI,
    META_WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN,
    META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION,
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (e: unknown) {
  const zodErr = e as z.ZodError;
  if (zodErr && Array.isArray(zodErr.issues)) {
    console.warn("⚠️ Environment variables missing or unconfigured (Using fallback defaults for build/dev):");
    zodErr.issues.forEach((issue: any) => {
      const pathStr = Array.isArray(issue.path) ? issue.path.join(".") : String(issue.path || "");
      console.warn(`   - ${pathStr}: ${issue.message}`);
    });
  }
  parsedEnv = {
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/dbname",
    SESSION_SECRET: process.env.SESSION_SECRET || "fallback_session_secret_at_least_32_chars_long_12345",
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "fallback_encryption_key_at_least_32_chars_long_12345",
    META_APP_ID: process.env.META_APP_ID || "",
    META_APP_SECRET: process.env.META_APP_SECRET || "",
    META_REDIRECT_URI: process.env.META_REDIRECT_URI || "http://localhost:3000/api/instagram/callback",
    META_WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN || "",
    META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION || "v23.0",
    NODE_ENV: (process.env.NODE_ENV as "development" | "production" | "test") || "development",
  };
}

export const env = parsedEnv;
