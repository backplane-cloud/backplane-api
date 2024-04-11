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
 *     App:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - ownerId
 *         - orgId
 *         - cloud
 *         - environments
 *         - status
 *         - type
 *         - appTemplate
 *         - repo
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the app
 *         name:
 *           type: string
 *           description: App name
 *         code:
 *           type: string
 *           description: App Code generated from name
 *         ownerId:
 *           type: string
 *           description: UID of App Owner
 *         orgId:
 *           type: string
 *           description: The Org ID to which the app is a member of
 *         cloud:
 *           type: string
 *           description: Cloud Platform e.g. Azure, AWS or GCP
 *         environments:
 *            type: array
 *            description: Array of Objects for each environment
 *         status:
 *           type: string
 *           description: Specifies whether the App is Active, Disabled or Decomissioned
 *         type:
 *           type: string
 *           description: The model of the resource (auto generated)
 *         appTemplate:
 *            type: string
 *            description: The Name of the App Template this App was created from
 *         repo:
 *           type: string
 *           description: Name of Repo
 *       example:
 *         _id: 64e89ef5803c0f39f16722d9
 *         name: Demo App 3
 *         code: demo-app-3
 *         ownerId: 64e004034fdf8d60986ce9d9
 *         orgId: 64e004034fdf8d60986ce9d7
 *         cloud: azure
 *         environments: [{name=prod; accountId=/subscriptions/2a04f460-f517-4085-808d-7877fd30ea72/resourceGroups/_bp-demo-organisation-demo-app-2-prod}, {name=nonprod; accountId=/subscriptions/2a04f460-f517-4085-808d-7877fd30ea72/resourceGroups/_bp-demo-organisation-demo-app-2-nonprod}]
 *         status: active
 *         type: app
 *         appTemplate: default
 *         repo: lewis-backplane/demo-app-3
 *         createdAt: 2023-08-25T00:53:14.376Z
 *         updatedAt: 2023-08-25T00:53:14.376Z
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: App
 *   description: App resources have environments created in the specified `cloud` platform. The environments create is determined by the optional `appTemplate` field specified
 */

/**
 * @swagger
 * /apps:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Apps
 *    tags: [App]
 *    responses:
 *      200:
 *        description: Returns all Apps in Org
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/App'
 *
 */

/**
 * @swagger
 * /apps/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the App by ID
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Returns App Resource
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /apps:
 *   post:
 *     summary: Create App
 *     tags: [App]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name
 *               cloud:
 *                 type: string
 *                 description: Cloud
 *               appTemplate:
 *                 required: false
 *                 type: string
 *                 enum:
 *                   - default
 *                   - sandbox
 *                 description: Name
 *     responses:
 *       200:
 *         description: App created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/App'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /apps/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a App by ID
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The App ID
 *     responses:
 *       200:
 *         description: The app description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /apps/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an App by ID
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The App ID
 *     responses:
 *       200:
 *         description: The Updated App
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /apps/{id}/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get App Requests
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The App ID
 *     responses:
 *       200:
 *         description: App Requests
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /apps/{id}/billing:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get App Billing
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The App ID
 *     responses:
 *       200:
 *         description: App Billing
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getApp,
  getApps,
  setApp,
  updateApp,
  deleteApp,
  getAppBilling,
  getAppRequests,
  getAppAccess,
  getAppPolicies,
  getAppCost,
  getAppEnvironments,
  getAppOverview,
  findApp,
} from "../controllers/appController.js";

router.route("/").get(protect, authz, getApps).post(protect, authz, setApp);
router.route("/search").get(protect, authz, findApp);
router
  .route("/:id")
  .get(protect, authz, getApp)
  .put(protect, authz, updateApp)
  .delete(protect, authz, deleteApp);

// Routes HTMXified for App Tabs in UI
router.route("/:id/environments").get(protect, authz, getAppEnvironments);
router.route("/:id/overview").get(protect, authz, getAppOverview);
router.route("/:id/access").get(protect, authz, getAppAccess);
router.route("/:id/policy").get(protect, authz, getAppPolicies);

router.route("/:id/billing").get(protect, authz, getAppBilling);
router.route("/:id/requests").get(protect, authz, getAppRequests);
router.route("/:id/cost").get(protect, authz, getAppCost);

// UI Actions
// router.route("/:id/disable").get(protect, authz, disableApp ); // Need to implement

export default router;
