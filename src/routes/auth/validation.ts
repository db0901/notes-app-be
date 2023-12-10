import { z } from "zod";

import { ZodValidation } from "middleware/validate";

export const loginSchema: ZodValidation = z.object({
  body: z.object({
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Must be a valid email" }),
  }),
});

export const registerSchema: ZodValidation = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .optional(),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Must be a valid email" }),
  }),
});
