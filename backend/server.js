import express from "express";
// import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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

import cloudRoutes from "./routes/cloudRoutes.js";

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

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use("/openapi", swaggerUI.serve, swaggerUI.setup(specs));

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

  app.use("/api/cloud", cloudRoutes);

  app.get("/", (req, res) => res.send("Backplane REST API Server is ready"));
  return;
}
// app.listen(port, () =>
//   console.log(`Backplane REST API Server started on port ${port}`)
// );
