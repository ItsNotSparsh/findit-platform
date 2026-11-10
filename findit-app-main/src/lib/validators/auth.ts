import { z } from "zod";

export const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Use only letters, numbers, and underscores"),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(72, "Password must be at most 72 characters"),
});
