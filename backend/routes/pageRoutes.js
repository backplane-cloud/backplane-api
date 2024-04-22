import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();

import { setup } from "../views/setup.js";

router.route("/setup").get(protect, authz, (req, res) => {
  res.send(setup());
});

export default router;
