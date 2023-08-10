import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getPlatform,
  getPlatforms,
  setPlatform,
  updatePlatform,
  deletePlatform,
  getPlatformRequests,
} from "../controllers/platformController.js";

router
  .route("/")
  .get(protect, authz, getPlatforms)
  .post(protect, authz, setPlatform);
router
  .route("/:id")
  .get(protect, authz, getPlatform)
  .put(protect, authz, updatePlatform)
  .delete(protect, authz, deletePlatform);

router.route("/:id/requests").get(protect, getPlatformRequests);

export default router;
