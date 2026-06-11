import Elysia from "elysia";
import { requireAuth } from "@/middlewares/auth.middleware";
import { orderService } from "@/services/order.service";
import { checkoutSchema } from "@/models/order";
import { ok } from "@/utils/response";
import { API_BASE } from "@/config/constants";
import { UnauthorizedError } from "@/utils/errors";

export const orderController = new Elysia({ prefix: `${API_BASE}/orders` })
  .use(requireAuth)

  .post(
    "/",
    async ({ body, user, set }) => {
      if (!user?.sub || typeof user.sub !== "string") throw new UnauthorizedError();
      const result = await orderService.checkout(user.sub, body);
      set.status = 201;
      return ok(result, "Order created succesfully");
    },
    { body: checkoutSchema }
  )
  
  .get("/", async ({ user }) => {
    if (!user?.sub || typeof user.sub !== "string") throw new UnauthorizedError();
    const items = await orderService.findUserOrderItems(user.sub);
    return ok(items, "User orders retrieved successfully");
  });