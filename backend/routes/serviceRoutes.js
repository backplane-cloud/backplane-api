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
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the service
 *         name:
 *           type: string
 *           description: Service name
 *         email:
 *           type: string
 *           description: Service E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Service Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the requesters orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         serviceType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Role Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Organisation Services
 */

/**
 * @swagger
 * /services:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all services in the Org
 *    tags: [Service]
 *    responses:
 *      200:
 *        description: List of all services
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Service'
 *
 */

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Service by ID
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Service ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Creates a new Service within an Organisation
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Service'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Service by ID
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Service ID
 *     responses:
 *       200:
 *         description: The service description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 */

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Service by ID
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Service ID
 *     responses:
 *       200:
 *         description: The Updated Service
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getService,
  getServices,
  setService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

router
  .route("/")
  .get(protect, authz, getServices)
  .post(protect, authz, setService);
router
  .route("/:id")
  .get(protect, authz, getService)
  .put(protect, authz, updateService)
  .delete(protect, authz, deleteService);

export default router;
