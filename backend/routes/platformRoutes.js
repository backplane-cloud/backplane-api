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
 *     Platform:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the platform
 *         name:
 *           type: string
 *           description: Platform name
 *         code:
 *           type: string
 *           description: Code is derived from name
 *         type:
 *           type: string
 *           description: Resource Type e.g. platform
 *         status:
 *           type: string
 *           description: Active or Disabled
 *         orgId:
 *           type: string
 *           description: Org ID
 *         ownerId:
 *            type: string
 *            description: User ID of Owner
 *         budget:
 *           type: object
 *           properties:
 *             year:
 *               type: string
 *             budget:
 *               type: number
 *             budgetAllocated:
 *               type: number
 *             currency:
 *               type: string
 *       example:
 *         _id: 64f10986a3e5c3488c84601e
 *         code: platform-name
 *         name: Platform Name
 *         type: platform
 *         status: active
 *         budget: [{}]
 *         createdAt: 2023-08-31T21:43:35.050Z
 *         updatedAt: 2023-08-31T21:43:35.050Z
 *         ownerId: 64f10986a3e5c3488c846020
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Platform
 *   description: Platforms are children of `Orgs` and parents of `Products`
 */

/**
 * @swagger
 * /platforms:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Platforms
 *    tags: [Platform]
 *    responses:
 *      200:
 *        description: Returns all Platforms
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Platform'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /platforms/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Platform by ID
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Platform ID
 *     responses:
 *       200:
 *         description: Returns an Platform
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /platforms:
 *   post:
 *     summary: Create Platform
 *     tags: [Platform]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Platform
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Platform
 *               currency:
 *                 type: string
 *                 description: Currency of Platform
 *     responses:
 *       200:
 *         description: The Platform was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Platform'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Platform by ID
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Platform ID
 *     responses:
 *       200:
 *         description: Platform Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Platform by ID
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Platform ID
 *     responses:
 *       200:
 *         description: Platform Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /platforms/{id}/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Platform Requests
 *     tags: [Platform]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Platform ID
 *     responses:
 *       200:
 *         description: Platform Requests
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getPlatform,
  getPlatforms,
  setPlatform,
  updatePlatform,
  deletePlatform,
  getPlatformRequests,
  getPlatformOverviewTab,
} from "../controllers/platformController.js";

router
  .route("/")
  .get(protect, authz, getPlatforms)
  .post(protect, authz, setPlatform);
router
  .route("/:id")
  .get(protect, authz, getPlatform)
  .put(protect, authz, updatePlatform)
  .delete(protect, authz, deletePlatform);

router.route("/:id/overview").get(protect, authz, getPlatformOverviewTab);
router.route("/:id/requests").get(protect, authz, getPlatformRequests);

export default router;
