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
 *         example:
 *           name: Lewis Sheridan
 *           email: lewis@backplane.cloud
 *           password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Organisation Users
 */

/**
 * @swagger
 * /users:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all users in the Org
 *    tags: [User]
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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the User by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The User ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: The User was not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new User within an Organisation
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/User'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registers a new User and Creates a new Organisation
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/User'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a User by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The User ID
 *     responses:
 *       200:
 *         description: The user description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: The User was not found
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Logs in a User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user has successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/User'
 *       500:
 *         description: Server Error
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
router.route("/register").post(registerUser);
router
  .route("/")
  .post(protect, authz, createUser)
  .get(protect, authz, getUsers);

router
  .route("/:id")
  .get(protect, authz, getUser)
  .put(protect, authz, updateUser)
  .delete(protect, authz, deleteUser);

export default router;
