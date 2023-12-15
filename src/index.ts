import "module-alias/register";

import express, { Request, Response } from "express";
import { Server } from "http";

import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "helpers/db";
import router from "./router";

dotenv.config();

export const app = express();
export let server: Server;

app.use(cors());
app.use(express.json());

app.use("", router);
app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
    route: req.path,
  });
});

try {
  connectDB().then(() => {
    console.log("Database connected");
    const port = process.env.PORT || 4000;
    server = app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  });
} catch (err) {
  console.log(err);
}

// TODO: Deploy
