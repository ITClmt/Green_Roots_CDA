import { z } from "zod";

const orderSchema = z.object({
  tree_id: z.uuid(),
  quantity: z.number().int().min(1),
});

export const checkoutSchema = z.array(orderSchema).min(1);

export type CheckoutDto = z.infer<typeof checkoutSchema>;
