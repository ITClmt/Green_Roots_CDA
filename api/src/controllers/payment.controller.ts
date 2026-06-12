import Elysia from "elysia";
import { API_BASE } from "@/config/constants";
import { paymentService } from "@/services/payment.service";
import { logger } from "@/utils/logger";
import { fail, ok } from "@/utils/response";

export const paymentController = new Elysia({
  prefix: `${API_BASE}/payments`,
}).post(
  "/webhook",
  async ({ request, body, set }) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      set.status = 400;
      return fail("Missing stripe-signature header");
    }

    let event;
    try {
      event = await paymentService.constructEvent(body as string, signature);
    } catch (err) {
      logger.warn(
        { message: err instanceof Error ? err.message : String(err) },
        "Stripe webhook signature verification failed",
      );
      set.status = 400;
      return fail("Invalid signature");
    }

    try {
      await paymentService.handleEvent(event);
    } catch (err) {
      logger.error(
        {
          message: err instanceof Error ? err.message : String(err),
          type: event.type,
        },
        "Stripe webhook handler error",
      );
      set.status = 500;
      return fail("Webhook handler error");
    }

    return ok({ received: true });
  },
  {
    parse: ({ request }) => request.text(),
  },
);
