import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const updateUserSchema = z.object({
  email: z.email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export const refreshSchema = z.object({ refreshToken: z.string() });

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
