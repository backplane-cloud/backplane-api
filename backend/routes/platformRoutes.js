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
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the platform
 *         name:
 *           type: string
 *           description: Platform name
 *         email:
 *           type: string
 *           description: Platform E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Platform Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the platformers orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         platformType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Platform Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Platform
 *   description: Organisation Platforms
 */

/**
 * @swagger
 * /platforms:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all platforms in the Org
 *    tags: [Platform]
 *    responses:
 *      200:
 *        description: List of all platforms
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Platform'
 *
 */

/**
 * @swagger
 * /platforms/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Platform by ID
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
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 */

/**
 * @swagger
 * /platforms:
 *   post:
 *     summary: Creates a new Platform within an Organisation
 *     tags: [Platform]
 *     platformBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Platform'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Platform'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /platforms/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Platform by ID
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
 *         description: The platform description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 */

/**
 * @swagger
 * /platforms/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Platform by ID
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
 *         description: The Updated Platform
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
 */

/**
 * @swagger
 * /platforms/{id}/requests:
 *   put:
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
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Platform'
 *       404:
 *         description: The Platform was not found
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

router.route("/:id/requests").get(protect, authz, getPlatformRequests);

export default router;
