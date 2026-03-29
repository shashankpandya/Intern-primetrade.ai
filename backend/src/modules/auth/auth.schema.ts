import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.email(),
    password: z
      .string()
      .min(8)
      .max(100)
      .regex(/[A-Z]/, "Password must include one uppercase letter")
      .regex(/[0-9]/, "Password must include one number"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1),
  }),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});
