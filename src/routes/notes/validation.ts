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
    content: z.string().optional(),
  }),
  headers: z.object({
    authorization: z.string({
      required_error: "Auth token is required",
    }),
  }),
});

export const findOneSchema = z.object({
  params: z.object({
    id: z
      .string()
      .regex(isNumericString, "Id must be a numeric string")
      .max(10, { message: "Id must be less than 10 characters" }),
  }),
});

export const findAllSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }).refine(
      (value) => {
        return isValidObjectId(value);
      },
      { message: "Invalid ID" }
    ),
  }),
});
