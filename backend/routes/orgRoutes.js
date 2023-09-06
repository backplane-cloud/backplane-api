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
 *         _id: 64f10986a3e5c3488c84601e
 *         code: org-name
 *         name: Org Name
 *         type: org
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
 *   name: Org
 *   description: Organisation is the Top-level resource in the resource hierarchy e.g. Org contains Platforms which contain Products which contain Apps
 */

/**
 * @swagger
 * /orgs:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Orgs
 *    tags: [Org]
 *    responses:
 *      200:
 *        description: Returns all Orgs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Org'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /orgs/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Org by ID
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
 *         description: Returns an Org
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /orgs:
 *   post:
 *     summary: Create Org
 *     tags: [Org]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Org
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Org
 *               currency:
 *                 type: string
 *                 description: Currency of Org
 *     responses:
 *       200:
 *         description: The Org was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Org'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /orgs/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Org by ID
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
 *         description: Org Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /orgs/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Org by ID
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
 *         description: Org Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /orgs/{id}/requests:
 *   get:
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
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Org'
 *       404:
 *         description: The Org was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
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
