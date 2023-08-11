import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getRequest,
  getRequests,
  setRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
} from "../controllers/requestController.js";

router
  .route("/")
  .get(protect, authz, getRequests)
  .post(protect, authz, setRequest);

router.route("/:id/approve").get(approveRequest);
router.route("/:id/reject").get(rejectRequest);

router
  .route("/:id")
  .get(protect, authz, getRequest)
  .put(protect, authz, updateRequest)
  .delete(protect, authz, deleteRequest);

export default router;
