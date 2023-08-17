import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getOrg,
  getOrgs,
  setOrg,
  updateOrg,
  deleteOrg,
  getOrgRequests,
} from "../controllers/orgController.js";

router.route("/").get(protect, authz, getOrgs).post(protect, authz, setOrg);
router
  .route("/:id")
  .get(protect, authz, getOrg)
  .put(protect, authz, updateOrg)
  .delete(protect, authz, deleteOrg);

router.route("/:id/requests").get(protect, authz, getOrgRequests);

export default router;
