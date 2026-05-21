/**todo: add order controller */
import Elysia from "elysia";
import { requireAuth } from "@/middlewares/auth.middleware";
import { orderService } from "@/services/order.service";
import { checkoutSchema } from "@/models/order";
import { ok } from "@/utils/response";
import { API_BASE } from "@/config/constants";

export const orderController = new Elysia({ prefix: `${API_BASE}/orders` })
  .use(requireAuth)

  .post(
    "/",
    async ({ body, user, set }) => {
      const result = await orderService.checkout(user!.sub as string, body);
      set.status = 201;
      return ok(result, "Order created succesfully");
    },
    { body: checkoutSchema }
  );