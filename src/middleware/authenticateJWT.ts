import { isBefore } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import Security from "helpers/security";
import { StatusCode } from "helpers/statusCode";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // authorization: Bearer <token>
    const token = authHeader.split(" ")[1];

    const jwtResponse = Security.verifyToken(token) as JwtPayload;

    if (!jwtResponse)
      return res.status(StatusCode.Unauthorized).json({
        message: "Invalid token",
      });

    const expiresAt = jwtResponse.exp ? new Date(jwtResponse.exp * 1000) : null;

    if (!expiresAt)
      return res.status(StatusCode.InternalServerError).json({
        message: "Token error - Error decoding exp",
      });

    if (isBefore(expiresAt, new Date()))
      return res.status(StatusCode.Forbidden).json({
        message: "Token expired",
      });

    // couldn't find a way to type this. So brute force was needed
    req.userId = jwtResponse.userId!;
    req.authToken = token;
    next();
  } else {
    return res.status(StatusCode.BadRequest).json({
      message: "No token provided",
    });
  }
};
