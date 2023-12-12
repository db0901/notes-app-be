import "module-alias/register";

import express, { Request, Response } from "express";

import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "helpers/db";
import routes from "routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("", routes);
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
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  });
} catch (err) {
  console.log(err);
}
