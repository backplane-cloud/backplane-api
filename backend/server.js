import express from "express";
import dotenv from "dotenv";
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

dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.get("/", (req, res) => res.send("Backplane REST API Server is ready"));

app.listen(port, () =>
  console.log(`Backplane REST API Server started on port ${port}`)
);
