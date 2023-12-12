import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import Security from "helpers/security";

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
      return res.status(403).json({
        message: "Invalid token",
      });

    // couldn't find a way to type this. So brute force was needed
    req.userId = jwtResponse.userId!;
    next();
  } else {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};
