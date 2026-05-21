import { z } from "zod";

export const createTreeSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  co2: z.number().int().min(0).optional(),
  oxygen: z.number().int().min(0).optional(),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  stock: z.number().int().min(0).optional(),
});

export const updateTreeSchema = createTreeSchema.partial();

export type CreateTreeDto = z.infer<typeof createTreeSchema>;
export type UpdateTreeDto = z.infer<typeof updateTreeSchema>;
