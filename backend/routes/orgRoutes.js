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
 *     Org:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the org
 *         name:
 *           type: string
 *           description: Org name
 *         email:
 *           type: string
 *           description: Org E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Org Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the orgers orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         orgType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Org Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Org
 *   description: Organisation Orgs
 */

/**
 * @swagger
 * /orgs:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all orgs in the Org
 *    tags: [Org]
 *    responses:
 *      200:
 *        description: List of all orgs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Org'
 *
 */

/**
 * @swagger
 * /orgs/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Org by ID
 *     tags: [Org]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Org ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 */

/**
 * @swagger
 * /orgs:
 *   post:
 *     summary: Creates a new Org within an Organisation
 *     tags: [Org]
 *     orgBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Org'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Org'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /orgs/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Org by ID
 *     tags: [Org]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Org ID
 *     responses:
 *       200:
 *         description: The org description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 */

/**
 * @swagger
 * /orgs/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Org by ID
 *     tags: [Org]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Org ID
 *     responses:
 *       200:
 *         description: The Updated Org
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 */

/**
 * @swagger
 * /orgs/{id}/requests:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Org Requests
 *     tags: [Org]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Org ID
 *     responses:
 *       200:
 *         description: Org Requests
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getOrg,
  getOrgs,
  setOrg,
  updateOrg,
  deleteOrg,
  getOrgRequests,
} from "../controllers/orgController.js";

router.route("/").get(protect, authz, getOrgs).post(protect, authz, setOrg);
router
  .route("/:id")
  .get(protect, authz, getOrg)
  .put(protect, authz, updateOrg)
  .delete(protect, authz, deleteOrg);

router.route("/:id/requests").get(protect, authz, getOrgRequests);

export default router;
