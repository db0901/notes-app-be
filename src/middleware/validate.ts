import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export type ZodValidation = z.ZodObject<{
  body?: z.AnyZodObject;
  headers?: z.AnyZodObject;
  params?: z.AnyZodObject;
  query?: z.AnyZodObject;
}>;

export const validate =
  (schema: ZodValidation) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await schema.safeParse({
      body: req.body,
      headers: req.headers,
      params: req.params,
      query: req.query,
    });

    if (!data.success) {
      return res.status(400).json(data.error.flatten().fieldErrors);
    }
    return next();
  };
