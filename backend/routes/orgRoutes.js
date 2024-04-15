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
 *         - license
 *         - owner
 *         - budget
 *         - currency
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the org
 *         name:
 *           type: string
 *           description: Org name
 *         code:
 *           type: string
 *           description: auto-generated from name
 *         license:
 *           type: string
 *           decription: Enterprise or Open Source
 *         csp:
 *           type: object
 *           properties:
 *             provider:
 *               type: string
 *               description: Cloud Service Provider e.g. Azure
 *             tenandId:
 *               type: string
 *               description: tenant id
 *             clientId:
 *               type: string
 *             clientSecret:
 *               type: string
 *         type:
 *           type: string
 *           description: Resource Type e.g. org
 *         status:
 *           type: string
 *           description: Active or Disabled
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
 *   description: Organisation is the Top-level resource in the resource hierarchy e.g. `Org` contains many `Platforms` which contain many `Products` which contain many `Apps`
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
  getOrgOverviewTab,
  findOrg,
  getOrgCloud,
  updateOrgCloud,
  deleteOrgCloud,
  addOrgCloud,
  getOrgTemplates,
  getOrgBudgets,
  getOrgCost,
  createOrgUI,
} from "../controllers/orgController.js";

import { getUsers } from "../controllers/userController.js";
import { getTeams } from "../controllers/teamController.js";
import { getAssignments } from "../controllers/assignmentController.js";
import { getRoles } from "../controllers/roleController.js";
import { getApps } from "../controllers/appController.js";
import { getProducts } from "../controllers/productController.js";
import { getPlatforms } from "../controllers/platformController.js";

router.route("/").get(protect, authz, getOrgs).post(protect, authz, setOrg);
router.route("/search").get(protect, authz, findOrg);
router.route("/create").get(protect, authz, createOrgUI);
router
  .route("/:id")
  .get(protect, authz, getOrg)
  .put(protect, authz, updateOrg)
  .delete(protect, authz, deleteOrg);

router.route("/:id/overview").get(protect, authz, getOrgOverviewTab);

// Routes to get Cloud Credentials
router
  .route("/:id/azure")
  .get(protect, authz, getOrgCloud)
  .put(protect, authz, updateOrgCloud)
  .delete(protect, authz, deleteOrgCloud)
  .post(protect, authz, addOrgCloud);

router
  .route("/:id/gcp")
  .get(protect, authz, getOrgCloud)
  .put(protect, authz, updateOrgCloud)
  .delete(protect, authz, deleteOrgCloud)
  .post(protect, authz, addOrgCloud);

router
  .route("/:id/aws")
  .get(protect, authz, getOrgCloud)
  .put(protect, authz, updateOrgCloud)
  .delete(protect, authz, deleteOrgCloud)
  .post(protect, authz, addOrgCloud);

// Paths for HTMX Responses
router.route("/:id/users").get(protect, authz, getUsers);
router.route("/:id/teams").get(protect, authz, getTeams);
router.route("/:id/assignments").get(protect, authz, getAssignments);
router.route("/:id/roles").get(protect, authz, getRoles);
router.route("/:id/platforms").get(protect, authz, getPlatforms);
router.route("/:id/products").get(protect, authz, getProducts);
router.route("/:id/apps").get(protect, authz, getApps);
router.route("/:id/templates").get(protect, authz, getOrgTemplates);
router.route("/:id/budgets").get(protect, authz, getOrgBudgets);

router.route("/:id/requests").get(protect, authz, getOrgRequests);
router.route("/:id/cost").get(protect, authz, getOrgCost);

export default router;
