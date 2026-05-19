import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { rateLimit } from "elysia-rate-limit";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { env } from "@/config/env";
import { db } from "@/db/client";
import { middlewares } from "@/middlewares";
import { routes } from "@/routes";
import { logger } from "@/utils/logger";
import { fail } from "@/utils/response";
import { refreshTokenService } from "@/services/refresh-token.service";

await migrate(db, { migrationsFolder: "./drizzle" });

setInterval(() => refreshTokenService.deleteExpired(), 60 * 60 * 1000);

export const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .use(rateLimit({
    duration: 60000,
    max: 200,
    errorResponse: new Response(
      JSON.stringify(fail("Too many requests, please try again later")),
      { status: 429, headers: { "Content-Type": "application/json" } }
    ),
  }))
  .use(middlewares)
  .use(routes)
  .listen(env.PORT);

logger.info(`Server running on http://localhost:${env.PORT}`);

export type App = typeof app;
