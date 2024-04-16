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
 *     Assignment:
 *       type: object
 *       required:
 *         - type
 *         - scope
 *         - prinicpal
 *         - principalRef
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the assignment
 *         type:
 *           type: string
 *           description: user or group assignment
 *         scope:
 *           type: string
 *           description: Scope of Assignment e.g. /orgs/64e004034fdf8d60986ce9d7
 *         principal:
 *           type: string
 *           description: Principal ID, e.g. User ID or Group ID
 *         principalRef:
 *           type: string
 *           description: Resource Type e.g. User or Group
 *         role:
 *           type: string
 *           description: Role ID
 *       example:
 *         _id: 64f1076d064fb660bfb2fc45
 *         type: user
 *         scope: /orgs/64f1076c064fb660bfb2fc39
 *         principal: 64f1076c064fb660bfb2fc3b
 *         principalRef: User
 *         role: 64f1076d064fb660bfb2fc3e
 *         orgId: 64f1076c064fb660bfb2fc39
 *         createdAt: 2023-08-31T21:34:37.212Z
 *         updatedAt: 2023-08-31T21:34:37.212Z
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Assignment
 *   description: Assignment resource comprise a `identity`, `role` and `scope`. The identity can be a User or Team object ID.
 */

/**
 * @swagger
 * /assignments:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Role Assignments
 *    tags: [Assignment]
 *    responses:
 *      200:
 *        description: Successfully returns list of all role assignments
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Assignment'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create Role Assignment
 *     tags: [Assignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               type:
 *                 type: string
 *                 description: e.g. User or Group
 *               principal:
 *                 type: string
 *                 description: Resource ID of the User or Group resource
 *               principalRef:
 *                 type: string
 *                 description: Resource ID of the User or Group resource
 *               scope:
 *                 required: true
 *                 type: string
 *                 description: Org URI
 *               role:
 *                 type: string
 *                 description: Role ID
 *     responses:
 *       200:
 *         description: The assignment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Assignment by ID
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Assignment ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: The Assignment was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Assignment by ID
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Assignment ID
 *     responses:
 *       200:
 *         description: The assignment description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: The Assignment was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Assignment by ID
 *     tags: [Assignment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               role:
 *                 type: string
 *                 description: Role ID
 *     responses:
 *       200:
 *         description: The Updated Assignment
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: The Assignment was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

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
  getAssignmentOverviewTab,
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

router.route("/:id/overview").get(protect, authz, getAssignmentOverviewTab);

export default router;
