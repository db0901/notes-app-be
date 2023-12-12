import { Request, Response } from "express";

import Security from "helpers/security";
import { User } from "schemas/user";

export const login = async (req: Request, res: Response) => {
  const body: { email: string; password: string } = req.body;
  const user = await User.findOne({ email: body.email });

  if (!user)
    return res.status(403).json({
      message: "No user with that email",
    });

  const isMatch = await Security.checkPassword(
    body.password,
    user.passwordHash
  );

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = Security.generateToken(user._id.toString());

  return res.json({
    id: user._id,
    username: user.username,
    email: user.email,
    authToken: token,
  });
};

export const register = async (req: Request, res: Response) => {
  const body: {
    email: string;
    password: string;
    username: string | undefined;
  } = req.body;

  const user = await User.findOne({ email: body.email });

  if (user)
    return res.status(409).json({
      message: "User with that email already exists",
    });

  const passwordHash = await Security.hashPassword(body.password);

  if (!passwordHash)
    return res.status(500).json({
      message: "Password error, contact system admin",
    });

  const newUser = new User({
    username: body.username || "",
    passwordHash: passwordHash,
    email: body.email,
  });
  await newUser.save();

  const token = Security.generateToken(newUser._id.toString());

  return res.json({
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    authToken: token,
  });
};
