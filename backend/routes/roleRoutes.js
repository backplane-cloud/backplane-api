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
 *     Role:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: Role name
 *         email:
 *           type: string
 *           description: Role E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Role Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the requesters orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         roleType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Role Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Organisation Roles
 */

/**
 * @swagger
 * /roles:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all roles in the Org
 *    tags: [Role]
 *    responses:
 *      200:
 *        description: List of all roles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Role'
 *
 */

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Creates a new Role within an Organisation
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Role'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: The role description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 */

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Role by ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: The Updated Role
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 */

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
