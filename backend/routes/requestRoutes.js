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
 *     Request:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the request
 *         name:
 *           type: string
 *           description: Request name
 *         email:
 *           type: string
 *           description: Request E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Request Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the requesters orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         requestType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Request Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Request
 *   description: Organisation Requests
 */

/**
 * @swagger
 * /requests:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all requests in the Org
 *    tags: [Request]
 *    responses:
 *      200:
 *        description: List of all requests
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Request'
 *
 */

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Request by ID
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Request ID
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Creates a new Request within an Organisation
 *     tags: [Request]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Request'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Request by ID
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Request ID
 *     responses:
 *       200:
 *         description: The request description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 */

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Request by ID
 *     tags: [Request]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Request ID
 *     responses:
 *       200:
 *         description: The Updated Request
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getRequest,
  getRequests,
  setRequest,
  updateRequest,
  deleteRequest,
  approveRequest,
  rejectRequest,
  getMyRequests,
} from "../controllers/requestController.js";

router
  .route("/")
  .get(protect, authz, getRequests)
  .post(protect, authz, setRequest);

router.route("/me").get(protect, authz, getMyRequests);

router.route("/:id/approve").get(approveRequest);
router.route("/:id/reject").get(rejectRequest);

router
  .route("/:id")
  .get(protect, authz, getRequest)
  .put(protect, authz, updateRequest)
  .delete(protect, authz, deleteRequest);

export default router;
