import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import { home } from "../views/home.js";

router.route("/home").get(protect, authz, home);

export default router;
