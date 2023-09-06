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
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the assignment
 *         name:
 *           type: string
 *           description: Assignment name
 *         email:
 *           type: string
 *           description: Assignment E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Assignment Password
 *         assignmentId:
 *           type: string
 *           description: Assignment Id (Note this will be set to the assignmenters assignmentId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         assignmentType:
 *            type: string
 *            description: Assignment Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Assignment Assignments e.g. /assignments/<assignmentID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Assignment
 *   description: Assignmentanisation Assignments
 */

/**
 * @swagger
 * /assignments:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all assignments in the Assignment
 *    tags: [Assignment]
 *    responses:
 *      200:
 *        description: List of all assignments
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Assignment'
 *
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
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Creates a new Assignment within an Assignmentanisation
 *     tags: [Assignment]
 *     assignmentBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Assignment'
 *       500:
 *         description: Server Error
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
 *     responses:
 *       200:
 *         description: The Updated Assignment
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: The Assignment was not found
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
