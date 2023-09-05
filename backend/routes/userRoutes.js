/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *     - bearerAuth: []
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           description: User E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: User Password
 */

/**
 * @swagger
 * /users:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all users in the Org
 *    responses:
 *      200:
 *        description: List of all users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *
 */

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
