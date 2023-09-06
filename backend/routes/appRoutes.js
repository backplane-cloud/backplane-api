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
 *         appTemplate:
 *            type: string
 *            description: The Name of the App Template this App was created from
 *         repo:
 *           type: string
 *           description: Name of Repo
 *       example:
 *         name: Demo App 3
 *         code: demo-app-3
 *         ownerId: 64e004034fdf8d60986ce9d9
 *         orgId: 64e004034fdf8d60986ce9d7
 *         cloud: azure
 *         environments:
 *         status: active
 *         type: app
 *         appTemplate: default
 *         repo: lewis-backplane/demo-app-3
 */

/**
 * @swagger
 * tags:
 *   name: App
 *   description: Apps are created in a single Cloud
 */

/**
 * @swagger
 * /apps:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all apps in the App
 *    tags: [App]
 *    responses:
 *      200:
 *        description: List of all apps
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
 *         description: The App ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/App'
 *       404:
 *         description: The App was not found
 */

/**
 * @swagger
 * /apps:
 *   post:
 *     summary: Creates a new App within an Appanisation
 *     tags: [App]
 *     appBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/App'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/App'
 *       500:
 *         description: Server Error
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
 */

/**
 * @swagger
 * /apps/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a App by ID
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
 */
/**
 * @swagger
 * /apps/{id}/requests:
 *   put:
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
 */
/**
 * @swagger
 * /apps/{id}/billing:
 *   put:
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
} from "../controllers/appController.js";

router.route("/").get(protect, authz, getApps).post(protect, authz, setApp);
router
  .route("/:id")
  .get(protect, authz, getApp)
  .put(protect, authz, updateApp)
  .delete(protect, authz, deleteApp);

router.route("/:id/billing").get(protect, getAppBilling);
router.route("/:id/requests").get(protect, getAppRequests);

export default router;
