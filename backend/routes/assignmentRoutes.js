import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getAssignment,
  getAssignments,
  setAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

router
  .route("/")
  .get(protect, authz, getAssignments)
  .post(protect, authz, setAssignment);
router
  .route("/:id")
  .get(protect, authz, getAssignment)
  .put(protect, authz, updateAssignment)
  .delete(protect, authz, deleteAssignment);

export default router;
