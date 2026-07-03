import Elysia from "elysia";
import { API_BASE } from "@/config/constants";
import { requireAuth } from "@/middlewares/auth.middleware";
import { getUserBadges } from "@/services/badge.service";
import { UnauthorizedError } from "@/utils/errors";
import { ok } from "@/utils/response";

export const badgeController = new Elysia({ prefix: `${API_BASE}/badges` })
  .use(requireAuth)

  .get("/", async ({ user }) => {
    if (!user?.sub || typeof user.sub !== "string") throw new UnauthorizedError();
    const data = await getUserBadges(user.sub);
    return ok(data, "Badges retrieved successfully");
  });
