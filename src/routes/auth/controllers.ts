import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import Security from "helpers/security";
import { StatusCode } from "helpers/statusCode";
import { User } from "schemas/user";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const body: { email: string; password: string } = req.body;
  const user = await User.findOne({ email: body.email });

  if (!user)
    return res.status(StatusCode.Unauthorized).json({
      message: "No user with that email",
    });

  const isMatch = await Security.checkPassword(
    body.password,
    user.passwordHash
  );

  if (!isMatch) {
    return res.status(StatusCode.Unauthorized).json({
      message: "Invalid credentials",
    });
  }

  const token = Security.generateToken(user._id.toString());

  return res.status(StatusCode.OK).json({
    id: user._id,
    authToken: token,
    username: user.username,
  });
};

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: {
    email: string;
    password: string;
    username: string | undefined;
  } = req.body;

  const user = await User.findOne({ email: body.email });

  if (user)
    return res.status(StatusCode.Conflict).json({
      message: "User with that email already exists",
    });

  const passwordHash = await Security.hashPassword(body.password);

  if (!passwordHash)
    return res.status(StatusCode.InternalServerError).json({
      message: "Password error, contact system admin",
    });

  const newUser = new User({
    username: body.username || "",
    passwordHash: passwordHash,
    email: body.email,
  });
  await newUser.save();

  const token = Security.generateToken(newUser._id.toString());

  return res.status(StatusCode.Created).json({
    id: newUser._id,
    authToken: token,
    username: newUser.username,
  });
};

export const currentSession = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.userId;
  const token = req.authToken;

  const user = await User.findById(userId);

  if (!user)
    return res.status(StatusCode.Forbidden).json({
      message: "Does not exist a user with that ID",
    });

  const decodedToken = jwt.decode(token) as JwtPayload;

  const expiresAt = decodedToken.exp ? new Date(decodedToken.exp * 1000) : null;
  const issuedAt = decodedToken.iat ? new Date(decodedToken.iat * 1000) : null;

  if (!expiresAt)
    return res.status(StatusCode.InternalServerError).json({
      message: "Token error - Error decoding exp",
    });

  if (!issuedAt)
    return res.status(StatusCode.InternalServerError).json({
      message: "Token error - Error decoding iat",
    });

  return res.status(StatusCode.OK).json({
    email: user.email,
    expiresAt: expiresAt.toISOString(),
    issuedAt: issuedAt.toISOString(),
    userId: user._id,
    username: user.username,
  });
};
