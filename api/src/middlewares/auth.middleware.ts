import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { env } from "@/config/env";
import { UnauthorizedError } from "@/utils/errors";

export const jwtMiddleware = new Elysia({ name: "jwt-middleware" })
  .use(jwt({ name: "jwt", secret: env.JWT_SECRET, exp: "15m" }))
  .use(bearer())
  .derive({ as: "global" }, async ({ bearer, jwt }) => {
    const user = bearer ? await jwt.verify(bearer) : null;
    return { user: user || null };
  });

export const requireAuth = new Elysia({ name: "require-auth" })
  .use(jwtMiddleware)
  .onBeforeHandle({ as: "scoped" }, ({ user }) => {
    if (!user) throw new UnauthorizedError();
  });
