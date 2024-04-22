import express from "express";
// import dotenv from "dotenv";
import { exec } from "child_process";
import cookieParser from "cookie-parser";
import cors from "cors";

import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

import orgRoutes from "./routes/orgRoutes.js";
import platformRoutes from "./routes/platformRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import appRoutes from "./routes/appRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import backlogRoutes from "./routes/backlogRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";

import {
  syncAppCost,
  propagateAppCostToProduct,
  propagateProductCostToPlatform,
  propagatePlatformCostToOrg,
} from "./controllers/costController.js";

// Open API (Swagger)
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backplane API",
      version: "1.0.0",
      description:
        "Backplane API Server (Backplane Core) provides endpoints for Backplane CLI and Backplane Cloud.",
    },
    servers: [
      {
        url: "http://localhost:8000/api",
        description: "Local Development Server",
      },
      {
        url: "https://api.backplane.dev/api",
        description: "Development Server",
      },
    ],
  },
  apis: ["./backend/routes/*.js"],
};

export default function init(app) {
  const specs = swaggerJsDoc(options);

  // dotenv.config();

  connectDB();

  // const port = process.env.PORT || 5000;
  // const app = express();

  // app.use(notFound);
  // app.use(errorHandler);
  app.use(cors({ credentials: true })); // Enable CORS for all origins
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/openapi", swaggerUI.serve, swaggerUI.setup(specs));
  app.use("/pages", pageRoutes);

  app.use("/api/users", userRoutes);
  app.use("/api/teams", teamRoutes);
  app.use("/api/roles", roleRoutes);
  app.use("/api/assignments", assignmentRoutes);

  app.use("/api/orgs", orgRoutes);
  app.use("/api/platforms", platformRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/apps", appRoutes);

  app.use("/api/requests", requestRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/backlogs", backlogRoutes);
  app.use(express.static(path.join(__dirname, "../", "public")));
  // app.get("/", (req, res) => res.send("Backplane REST API Server is ready"));
  // Handle root URL ("/") to serve index.html
  app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
  });

  app.post("/cloudshell", (req, res) => {
    const command = req.body.command;

    console.log("Received Command:", command);
    console.log(command.slice(0, 2));
    if (command.trim().slice(0, 2) == "bp" || command.trim() === "clear") {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          res.status(500).send(error.message);
          return;
        }
        if (stderr) {
          res.status(400).send(stderr);
          return;
        }
        res.send(stdout);
      });
    } else {
      res.send(
        "Only the Backplane CLI commands are allowed, e.g. bp <resource> <action>"
      );
    }
  });
  return;
}

// // Comment out below section when publishing as NPM package
const app = express();
init(app);
const port = 8000;
app.listen(port, () =>
  console.log(`Backplane REST API Server started on port ${port}`)
);

// await syncAppCost();
setInterval(() => syncAppCost(), 21600000); // Sync every 6 hours

// await propagateAppCostToProduct();
setInterval(() => propagateAppCostToProduct(), 22200000); // Propagate ever 6hr 10m

// await propagateProductCostToPlatform();
setInterval(() => propagateProductCostToPlatform(), 22800000); // Propagate ever 6hr 20m

// await propagatePlatformCostToOrg();
setInterval(() => propagatePlatformCostToOrg(), 23400000); // Propagate ever 6hr 30m
