import { z } from "zod";

export const treeFormSchema = z.object({
  name: z.string().min(1, "Requis"),
  species: z.string().min(1, "Requis"),
  description: z.string().optional(),
  location: z.string().optional(),
  price: z.coerce.number().positive("Prix invalide"),
  imageUrl: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  co2: z.coerce.number().int().min(0),
  oxygen: z.coerce.number().int().min(0),
});

export type TreeFormInput = z.input<typeof treeFormSchema>;
export type TreeFormOutput = z.output<typeof treeFormSchema>;
