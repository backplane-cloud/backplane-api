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
 *         - type
 *         - actions
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: Role name
 *         type:
 *           type: string
 *           description: builtin or custom
 *         allowActions:
 *           type: array
 *           items:
 *             type: string
 *             description: Resource Type e.g. role
 *         orgId:
 *           type: string
 *           description: Org ID
 *       example:
 *         _id: 64f1076d064fb660bfb2fc43
 *         name: Reader for Google
 *         type: builtin
 *         allowActions: ['/read']
 *         orgId: 64f1076c064fb660bfb2fc39
 *         createdAt: 2023-08-31T21:43:35.050Z
 *         updatedAt: 2023-08-31T21:43:35.050Z
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Roles define allow actions and are used with `Assignments`
 */

/**
 * @swagger
 * /roles:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Roles
 *    tags: [Role]
 *    responses:
 *      200:
 *        description: Returns all Roles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Role'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Role by ID
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
 *         description: Returns an Role
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create Role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Role
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Role
 *               currency:
 *                 type: string
 *                 description: Currency of Role
 *     responses:
 *       200:
 *         description: The Role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Role by ID
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
 *         description: Role Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Role by ID
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
 *         description: Role Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}/actions:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Role Actions
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
 *         description: Role Requests
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}/actions:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Add Role Actions
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               allowActions:
 *                 type: string
 *                 description: /write
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: Role Requests
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /roles/{id}/actions:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove Role Actions
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               allowActions:
 *                 type: string
 *                 description: /write
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Role ID
 *     responses:
 *       200:
 *         description: Role Requests
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Role'
 *       404:
 *         description: The Role was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
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
  getRoleOverview,
} from "../controllers/roleController.js";

router.route("/").get(protect, authz, getRoles).post(protect, authz, setRole);
router
  .route("/:id")
  .get(protect, authz, getRole)
  .put(protect, authz, updateRole)
  .delete(protect, authz, deleteRole);

router.route("/:id/overview").get(protect, authz, getRoleOverview);

router
  .route("/:id/actions")
  .get(protect, authz, getRoleActions)
  .put(protect, authz, updateRoleActions)
  .patch(protect, authz, deleteRoleActions);

export default router;
