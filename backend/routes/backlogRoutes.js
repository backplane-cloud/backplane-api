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
 *     Backlog:
 *       type: object
 *       required:
 *         - orgId
 *         - productId
 *         - ownerId
 *         - velocity
 *         - sprintDuration
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the backlog
 *         orgId:
 *           type: string
 *           description: Org ID
 *         productId:
 *           type: string
 *           description: Product ID
 *         velocity:
 *           type: number
 *           description: Velocity calculated by average Story Points delivered in previous sprints
 *       example:
 */

/**
 * @swagger
 * tags:
 *   name: Backlog
 *   description: Backlogs is a child of a Product with many Sprints and Backlog Items
 */

/**
 * @swagger
 * /backlogs:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Backlogs
 *    tags: [Backlog]
 *    responses:
 *      200:
 *        description: Returns all Backlogs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Backlog'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /backlogs/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Backlog by ID
 *     tags: [Backlog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Backlog ID
 *     responses:
 *       200:
 *         description: Returns an Backlog
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Backlog'
 *       404:
 *         description: The Backlog was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /backlogs:
 *   post:
 *     summary: Create Backlog
 *     tags: [Backlog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Backlog
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Backlog
 *               currency:
 *                 type: string
 *                 description: Currency of Backlog
 *     responses:
 *       200:
 *         description: The Backlog was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Backlog'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /backlogs/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Backlog by ID
 *     tags: [Backlog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Backlog ID
 *     responses:
 *       200:
 *         description: Backlog Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Backlog'
 *       404:
 *         description: The Backlog was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /backlogs/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Backlog by ID
 *     tags: [Backlog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Backlog ID
 *     responses:
 *       200:
 *         description: Backlog Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Backlog'
 *       404:
 *         description: The Backlog was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getBacklog,
  getBacklogs,
  setBacklog,
  updateBacklog,
  deleteBacklog,
  getBacklogItem,
  getBacklogItems,
  setBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  getBacklogSprint,
  getBacklogSprints,
  setBacklogSprint,
  updateBacklogSprint,
  deleteBacklogSprint,
} from "../controllers/backlogController.js";

router
  .route("/")
  .get(protect, authz, getBacklogs)
  .post(protect, authz, setBacklog);
router
  .route("/:id")
  .get(protect, authz, getBacklog)
  .put(protect, authz, updateBacklog)
  .delete(protect, authz, deleteBacklog);
router
  .route("/:id/items")
  .get(protect, authz, getBacklogItems)
  .post(protect, authz, setBacklogItem);
router
  .route("/items/:id")
  .get(protect, authz, getBacklogItem)
  .put(protect, authz, updateBacklogItem)
  .delete(protect, authz, deleteBacklogItem);
router
  .route("/:id/sprints")
  .get(protect, authz, getBacklogSprints)
  .post(protect, authz, setBacklogSprint);
router
  .route("/sprints/:id")
  .get(protect, authz, getBacklogSprint)
  .put(protect, authz, updateBacklogSprint)
  .delete(protect, authz, deleteBacklogSprint);

export default router;
