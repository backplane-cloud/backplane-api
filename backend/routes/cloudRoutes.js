import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getCost,
  getAccess,
  getPolicy,
} from "../controllers/clouds/azureController.js";

router.route("/azure/cost/:id").get(protect, authz, getCost);
router.route("/azure/access/:id").get(protect, authz, getAccess);
router.route("/azure/policy/:id").get(protect, authz, getPolicy);

export default router;
