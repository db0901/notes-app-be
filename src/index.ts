import moduleAlias from "module-alias";
import path from "path";

import express, { Request, Response } from "express";
import { Server } from "http";

import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json";

// Add aliases - Should be before other imports
// Gives less problems than working with a package.json when switching between environments
moduleAlias.addAliases({
  helpers: path.join(__dirname, "helpers"),
  middleware: path.join(__dirname, "middleware"),
  routes: path.join(__dirname, "routes"),
  schemas: path.join(__dirname, "schemas"),
});

import { connectDB } from "helpers/db";
import router from "./router";

dotenv.config();

export const app = express();
export let server: Server;

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc({ swaggerDoc, apis: ["./routes/*.{js,ts}"] });
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
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
