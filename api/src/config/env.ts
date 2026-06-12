import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string().default("postgres"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().default("*"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "silent"]).default("info"),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  WEB_URL: z.url().default("http://localhost:5173"),
});

const parsed = schema.safeParse(Bun.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables:\n" + z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
