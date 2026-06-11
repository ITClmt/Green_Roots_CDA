import Elysia from "elysia";
import { requireAuth } from "@/middlewares/auth.middleware";
import { paymentService } from "@/services/payment.service";
import { orderService } from "@/services/order.service";
import { checkoutSchema } from "@/models/order";
import { ok } from "@/utils/response";
import { API_BASE } from "@/config/constants";
import { UnauthorizedError } from "@/utils/errors";

export const checkoutController = new Elysia({ prefix: `${API_BASE}/checkout` })
  .use(requireAuth)

  .post(
    "/session",
    async ({ body, user }) => {
      if (!user?.sub || typeof user.sub !== "string")
        throw new UnauthorizedError();
      const result = await paymentService.createCheckoutSession(user.sub, body);
      return ok(result, "Checkout session created");
    },
    { body: checkoutSchema },
  )

  .get("/orders/:sessionId", async ({ params, user }) => {
    if (!user?.sub || typeof user.sub !== "string")
      throw new UnauthorizedError();
    const summary = await orderService.getOrderSummaryBySession(
      user.sub,
      params.sessionId,
    );
    return ok(summary, "Order summary retrieved");
  });
