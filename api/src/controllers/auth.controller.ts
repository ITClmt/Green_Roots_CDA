import Elysia from "elysia";
import { jwtMiddleware, requireAuth } from "@/middlewares/auth.middleware";
import { authService } from "@/services/auth.service";
import { refreshTokenService } from "@/services/refresh-token.service";
import { registerSchema, loginSchema, refreshSchema } from "@/models/user";
import { ok } from "@/utils/response";
import { API_BASE } from "@/config/constants";

export const authController = new Elysia({ prefix: `${API_BASE}/auth` })
  .use(jwtMiddleware)

  .post(
    "/register",
    async ({ body, jwt, set }) => {
      const { user, refreshToken } = await authService.register(body);
      const accessToken = await jwt.sign({ sub: user.id, role: user.role });

      set.status = 201;
      return ok({ user, accessToken, refreshToken }, "Account created");
    },
    { body: registerSchema }
  )

  .post(
    "/login",
    async ({ body, jwt }) => {
      const { user, refreshToken } = await authService.validateCredentials(body);
      const accessToken = await jwt.sign({ sub: user.id, role: user.role });

      return ok({ user, accessToken, refreshToken });
    },
    { body: loginSchema }
  )

  .post(
    "/refresh",
    async ({ body, jwt }) => {
      const { user, token: newRefreshToken } = await refreshTokenService.rotate(body.refreshToken);
      const accessToken = await jwt.sign({ sub: user.id, role: user.role });

      return ok({ user, accessToken, refreshToken: newRefreshToken });
    },
    { body: refreshSchema }
  )

  .use(requireAuth)
  .post(
    "/logout",
    async ({ body, set }) => {
      await refreshTokenService.revoke(body.refreshToken);
      set.status = 204;
    },
    { body: refreshSchema }
  );
