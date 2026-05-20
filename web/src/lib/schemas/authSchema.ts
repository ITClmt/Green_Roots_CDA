import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email invalide."),
  password: z.string().min(1, "Le mot de passe est requis."),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis.").max(50),
  lastName: z.string().min(1, "Le nom est requis.").max(50),
  email: z.email("Email invalide."),
  password: z.string().min(8, "Minimum 8 caractères."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
