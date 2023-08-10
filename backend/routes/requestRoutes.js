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
} from "../controllers/requestController.js";

router
  .route("/")
  .get(protect, authz, getRequests)
  .post(protect, authz, setRequest);
router
  .route("/:id")
  .get(protect, authz, getRequest)
  .put(protect, authz, updateRequest)
  .delete(protect, authz, deleteRequest);

export default router;
