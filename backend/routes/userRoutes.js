import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

import {
  getUser,
  getUsers,
  updateUser,
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  updateMe,
  deleteUser,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();
router.route("/me").get(protect, authz, getMe).put(protect, authz, updateMe);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.route("/").post(registerUser).get(protect, authz, getUsers);
router.route("/create").post(protect, authz, createUser);

router
  .route("/:id")
  .get(protect, authz, getUser)
  .put(protect, authz, updateUser)
  .delete(protect, authz, deleteUser);

export default router;
