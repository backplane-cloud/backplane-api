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
 *         - code
 *         - description
 *         - url
 *         - apiKey
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the service
 *         name:
 *           type: string
 *           description: Service name
 *         code:
 *           type: string
 *           description: Code is derived from name
 *         description:
 *           type: string
 *           description: Description of the Service
 *         url:
 *           type: string
 *           description: URL of the Service
 *         apikey:
 *           type: string
 *           description: API Key
 *       example:
 *         _id: 64c258f655c8b3c24b8e6058
 *         code: github
 *         name: Github
 *         description: source control
 *         url: https://api.github.com/user/repos
 *         apikey: ghp_551J9m3XnHeLL0qRn37uYORrdmSBUl0AJTEK
 *         orgId: 649960a3f696f0c379649ee2
 *         ownerId: 649960a3f696f0c379649ee2
 *         createdAt: 2023-08-31T21:43:35.050Z
 *         updatedAt: 2023-08-31T21:43:35.050Z
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: Services are third party integrations
 */

/**
 * @swagger
 * /services:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Services
 *    tags: [Service]
 *    responses:
 *      200:
 *        description: Returns all Services
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Service'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Service by ID
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
 *         description: Returns an Service
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create Service
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Service
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Service
 *               currency:
 *                 type: string
 *                 description: Currency of Service
 *     responses:
 *       200:
 *         description: The Service was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Service by ID
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
 *         description: Service Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Service by ID
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
 *         description: Service Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Service'
 *       404:
 *         description: The Service was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
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
