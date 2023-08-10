import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getService,
  getServices,
  setService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

router
  .route("/")
  .get(protect, authz, getServices)
  .post(protect, authz, setService);
router
  .route("/:id")
  .get(protect, authz, getService)
  .put(protect, authz, updateService)
  .delete(protect, authz, deleteService);

export default router;
