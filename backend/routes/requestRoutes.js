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
 *         - requestType
 *         - requestedForType
 *         - requestedForId
 *         - appId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the request
 *         requestType:
 *           type: string
 *           description: link or budget
 *         orgId:
 *           type: string
 *           description: Org ID
 *         data:
 *           type: string
 *           description: ID of resource
 *         approvalCode:
 *           type: string
 *           description: Auto-generated for unauthenticated e-mail approval link
 *         approver:
 *           type: string
 *           description: User ID of Approver (Defaults to Owner)
 *         requestedBy:
 *            type: string
 *            description: User ID of Requester
 *         requestedForType:
 *            type: string
 *            description: org, platform, product or app
 *         requestedForId:
 *            type: string
 *            description: ID of resource requested for
 *         approvalStatus:
 *           type: string
 *           description: requested | approved | rejected
 *
 *       example:
 *         _id: 64e8001d2a734aaf3046ba19
 *         requestType: link
 *         orgId: 64e004034fdf8d60986ce9d7
 *         data: 64e7fb532a734aaf3046b9d4
 *         approvalCode: 48540549
 *         approver: 64e004034fdf8d60986ce9d9
 *         requestedBy: 64e004034fdf8d60986ce9d9
 *         requestedForType: product
 *         requestedForId: 64e00947220957d31b4841ce
 *         createdAt: 2023-08-31T21:43:35.050Z
 *         updatedAt: 2023-08-31T21:43:35.050Z
 *         ownerId: 64f10986a3e5c3488c846020
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Request
 *   description: Requests are used in Approval workflows for linking App to Products or Approving budgets
 */

/**
 * @swagger
 * /requests:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Requests
 *    tags: [Request]
 *    responses:
 *      200:
 *        description: Returns all Requests
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Request'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Request by ID
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
 *         description: Returns an Request
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create Request
 *     tags: [Request]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Request
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Request
 *               currency:
 *                 type: string
 *                 description: Currency of Request
 *     responses:
 *       200:
 *         description: The Request was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Request by ID
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
 *         description: Request Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Request by ID
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
 *         description: Request Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Request'
 *       404:
 *         description: The Request was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
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
  createRequestUI,
  getRequestOverviewTab,
} from "../controllers/requestController.js";

router
  .route("/")
  .get(protect, authz, getRequests)
  .post(protect, authz, setRequest);
router.route("/create").get(protect, authz, createRequestUI);
router.route("/me").get(protect, authz, getMyRequests);
router.route("/:id/overview").get(protect, authz, getRequestOverviewTab);

router.route("/:id/approve").get(approveRequest);
router.route("/:id/reject").get(rejectRequest);

router
  .route("/:id")
  .get(protect, authz, getRequest)
  .put(protect, authz, updateRequest)
  .delete(protect, authz, deleteRequest);

export default router;
