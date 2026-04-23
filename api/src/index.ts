import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { env } from "@/config/env";

export const app = new Elysia()
  .use(cors({ origin: env.CORS_ORIGIN }))
  .listen(env.PORT);

// eslint-disable-next-line no-console
console.log(`Server running on http://localhost:${env.PORT}`);

export type App = typeof app;
