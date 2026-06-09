import { z } from "zod";

export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Numéro de carte invalide (16 chiffres)"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format attendu : MM/AA"),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV invalide (3 ou 4 chiffres)"),
  cardHolder: z
    .string()
    .min(2, "Nom du titulaire requis"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
