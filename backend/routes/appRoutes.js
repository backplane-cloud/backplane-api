import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getApp,
  getApps,
  setApp,
  updateApp,
  deleteApp,
  getAppBilling,
  getAppRequests,
} from "../controllers/appController.js";

router.route("/").get(protect, authz, getApps).post(protect, authz, setApp);
router
  .route("/:id")
  .get(protect, authz, getApp)
  .put(protect, authz, updateApp)
  .delete(protect, authz, deleteApp);

router.route("/:id/billing").get(protect, getAppBilling);
router.route("/:id/requests").get(protect, getAppRequests);

export default router;
