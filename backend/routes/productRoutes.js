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
 *     Budget:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           year:
 *             type: string
 *           budget:
 *             type: number
 *           budgetAllocated:
 *             type: number
 *           currency:
 *             type: string
 *     Product:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product name
 *         code:
 *           type: string
 *           description: Code is derived from name
 *         type:
 *           type: string
 *           description: Resource Type e.g. product
 *         status:
 *           type: string
 *           description: Active or Disabled
 *         orgId:
 *           type: string
 *           description: Org ID
 *         ownerId:
 *            type: string
 *            description: User ID of Owner
 *         budget:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Budget'
 *         apps:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         _id: 64f10986a3e5c3488c84601e
 *         code: product-name
 *         name: Product Name
 *         type: product
 *         status: active
 *         budget: [{}]
 *         createdAt: 2023-08-31T21:43:35.050Z
 *         updatedAt: 2023-08-31T21:43:35.050Z
 *         ownerId: 64f10986a3e5c3488c846020
 *         apps: 64e7fb532a734aaf3046b9d4
 *         __v: 0
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Products are children of `Platforms` and parents of `Apps`
 */

/**
 * @swagger
 * /products:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Get all Products
 *    tags: [Product]
 *    responses:
 *      200:
 *        description: Returns all Products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *      401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Product ID
 *     responses:
 *       200:
 *         description: Returns an Product
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create Product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               displayname:
 *                 type: string
 *                 description: Display Name for Product
 *               license:
 *                 type: string
 *                 description: Default Open Source
 *               owner:
 *                 required: true
 *                 type: string
 *                 description: OwnerID
 *               budget:
 *                 type: number
 *                 description: budget for Product
 *               currency:
 *                 type: string
 *                 description: Currency of Product
 *     responses:
 *       200:
 *         description: The Product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server Error
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes Product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Product ID
 *     responses:
 *       200:
 *         description: Product Successfull Deleted
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates Product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Product ID
 *     responses:
 *       200:
 *         description: Product Sucessfully Updated
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

/**
 * @swagger
 * /products/{id}/requests:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Product Requests
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Product ID
 *     responses:
 *       200:
 *         description: Product Requests
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 *       401:
 *         description: Unauthorized, use `/users/login` to authenticate and retrieve access token
 */

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authz } from "../middleware/authzMiddleware.js";

const router = express.Router();
import {
  getProduct,
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProductCost,
  getProductRequests,
  getProductOverviewTab,
  findProduct,
  getProductBudgets,
  createProductUI,
} from "../controllers/productController.js";
import { getApps } from "../controllers/appController.js";

router
  .route("/")
  .get(protect, authz, getProducts)
  .post(protect, authz, setProduct);
router.route("/search").get(protect, authz, findProduct);
router.route("/create").get(protect, authz, createProductUI);
router
  .route("/:id")
  .get(protect, authz, getProduct)
  .put(protect, authz, updateProduct)
  .delete(protect, authz, deleteProduct);

router.route("/:id/overview").get(protect, authz, getProductOverviewTab);

router.route("/:id/cost").get(protect, authz, getProductCost);
router.route("/:id/requests").get(protect, authz, getProductRequests);
router.route("/:id/apps").get(protect, getApps);
router.route("/:id/budgets").get(protect, authz, getProductBudgets);

export default router;
