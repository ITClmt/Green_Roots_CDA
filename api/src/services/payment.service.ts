import type Stripe from "stripe";
import { env } from "@/config/env";
import { CURRENCY, stripe } from "@/lib/stripe";
import type { CheckoutDto } from "@/models/order";
import { checkAndUnlockBadges } from "@/services/badge.service";
import { orderService } from "@/services/order.service";
import { InternalError } from "@/utils/errors";
import { logger } from "@/utils/logger";

export const paymentService = {

  async createCheckoutSession(
    userId: string,
    items: CheckoutDto,
  ): Promise<{ url: string }> {
    const { orderId, lineItems } = await orderService.createPendingOrder(
      userId,
      items,
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems.map((line) => ({
        price_data: {
          currency: CURRENCY,
          product_data: { name: line.name },
          unit_amount: line.unitAmountCents,
        },
        quantity: line.quantity,
      })),
      success_url: `${env.WEB_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.WEB_URL}/checkout`,
      client_reference_id: userId,
      metadata: { orderId },
    });

    await orderService.attachSession(orderId, session.id);

    if (!session.url)
      throw new InternalError("Stripe n'a pas renvoyé d'URL de paiement");

    return { url: session.url };
  },



  constructEvent(rawBody: string, signature: string): Promise<Stripe.Event> {
    return stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  },

  async handleEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const userId = session.client_reference_id;
        if (orderId && session.payment_status === "paid") {
          await orderService.markOrderPaid(orderId);
          logger.info({ orderId }, "Order paid via Stripe");
          if (userId) await checkAndUnlockBadges(userId);
        }
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          await orderService.cancelPendingOrder(orderId);
          logger.info({ orderId }, "Order cancelled (Stripe session expired)");
        }
        break;
      }
      default:
        break;
    }
  },
};
