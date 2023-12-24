import express, { Request, Response } from "express";
import { Server } from "http";
import moduleAlias from "module-alias";
import path from "path";

import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

// Add aliases - Should be before other imports
// Gives less problems than working with a package.json when switching between environments
moduleAlias.addAliases({
  docs: path.join(__dirname, "docs"),
  helpers: path.join(__dirname, "helpers"),
  middleware: path.join(__dirname, "middleware"),
  routes: path.join(__dirname, "routes"),
  schemas: path.join(__dirname, "schemas"),
});

import swaggerSetup from "docs/swagger";
import { connectDB } from "helpers/db";
import router from "./router";

dotenv.config();

export const app = express();
export let server: Server;

app.use(cors());
app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSetup, { explorer: true })
);

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
