import Elysia from "elysia";
import { jwtMiddleware, requireAuth } from "@/middlewares/auth.middleware";
import { authService } from "@/services/auth.service";
import { refreshTokenService } from "@/services/refresh-token.service";
import { registerSchema, loginSchema } from "@/models/user";
import { ok } from "@/utils/response";
import { API_BASE, IS_PROD, REFRESH_COOKIE } from "@/config/constants";
import { UnauthorizedError } from "@/utils/errors";

/**
 * Le refresh token n'est jamais exposé au JavaScript du client : il voyage
 * dans un cookie httpOnly, restreint au préfixe /auth et interdit aux
 * requêtes intersites. Le front et l'API étant servis par la même origine
 * (proxy Vite en développement, Nginx en production), SameSite=Strict
 * suffit à écarter la falsification de requête intersite.
 */
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "strict" as const,
  path: `${API_BASE}/auth`,
  maxAge: REFRESH_TTL_SECONDS,
};

export const authController = new Elysia({ prefix: `${API_BASE}/auth` })
  .use(jwtMiddleware)

  .post(
    "/register",
    async ({ body, jwt, set, cookie }) => {
      const { user, refreshToken } = await authService.register(body);
      const accessToken = await jwt.sign({ sub: user.id, role: user.role });

      cookie[REFRESH_COOKIE]!.set({ value: refreshToken, ...cookieOptions });

      set.status = 201;
      return ok({ user, accessToken }, "Account created");
    },
    { body: registerSchema },
  )

  .post(
    "/login",
    async ({ body, jwt, cookie }) => {
      const { user, refreshToken } = await authService.validateCredentials(body);
      const accessToken = await jwt.sign({ sub: user.id, role: user.role });

      cookie[REFRESH_COOKIE]!.set({ value: refreshToken, ...cookieOptions });

      return ok({ user, accessToken });
    },
    { body: loginSchema },
  )

  .post("/refresh", async ({ jwt, cookie }) => {
    const current = cookie[REFRESH_COOKIE]?.value;
    if (!current || typeof current !== "string") throw new UnauthorizedError();

    const { user, token: newRefreshToken } =
      await refreshTokenService.rotate(current);
    const accessToken = await jwt.sign({ sub: user.id, role: user.role });

    cookie[REFRESH_COOKIE]!.set({ value: newRefreshToken, ...cookieOptions });

    return ok({ user, accessToken });
  })

  .use(requireAuth)
  .post("/logout", async ({ set, cookie }) => {
    const current = cookie[REFRESH_COOKIE]?.value;
    if (current && typeof current === "string") {
      await refreshTokenService.revoke(current);
    }
    // Expire le cookie côté navigateur.
    cookie[REFRESH_COOKIE]!.set({ value: "", ...cookieOptions, maxAge: 0 });

    set.status = 204;
  });
