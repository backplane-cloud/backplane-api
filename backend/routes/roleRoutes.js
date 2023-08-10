import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getRole,
  getRoles,
  setRole,
  updateRole,
  deleteRole,
  getRoleActions,
  updateRoleActions,
  deleteRoleActions,
} from "../controllers/roleController.js";

router.route("/").get(protect, authz, getRoles).post(protect, authz, setRole);
router
  .route("/:id")
  .get(protect, authz, getRole)
  .put(protect, authz, updateRole)
  .delete(protect, authz, deleteRole);

router
  .route("/:id/actions")
  .get(protect, authz, getRoleActions)
  .put(protect, authz, updateRoleActions)
  .patch(protect, authz, deleteRoleActions);

export default router;
