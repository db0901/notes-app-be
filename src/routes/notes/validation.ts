import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { isNumericString } from "helpers/regex";
import { ZodValidation } from "middleware/validate";

export const createSchema: ZodValidation = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .min(3, { message: "Title must be at least 3 characters" }),
    content: z
      .string()
      .trim()
      .min(3, {
        message: "If provided, content must have at least 3 characters",
      })
      .max(600)
      .optional(),
  }),
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
});

export const findAllSchema: ZodValidation = z.object({
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
  query: z.object({
    page: z
      .string()
      .regex(isNumericString, {
        message: "Invalid page value - should be numeric",
      })
      .transform(Number)
      .refine((v) => v > 0, {
        message: "Invalid page value - should be greater than 0",
      })
      .optional(),
    limit: z
      .string()
      .regex(isNumericString, {
        message: "Invalid page value - should be numeric",
      })
      .transform(Number)
      .refine((v) => v > 0, {
        message: "Invalid page value - should be greater than 0",
      })
      .optional(),
  }),
});

export const findOneSchema: ZodValidation = z.object({
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
  params: z.object({
    id: z.string().refine(
      (value) => {
        return isValidObjectId(value);
      },
      { message: "Invalid note ID" }
    ),
  }),
});

export const updateSchema: ZodValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .optional(),
    content: z
      .string()
      .trim()
      .min(3, { message: "Content must be at least 3 characters" })
      .max(600)
      .optional(),
  }),
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
  params: z.object({
    id: z.string().refine((value) => {
      return isValidObjectId(value);
    }),
  }),
});

export const removeSchema: ZodValidation = z.object({
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
  params: z.object({
    id: z.string().refine((value) => {
      return isValidObjectId(value);
    }),
  }),
});
