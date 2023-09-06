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
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Product name
 *         email:
 *           type: string
 *           description: Product E-mail address
 *         password:
 *           type: string
 *           format: password
 *           description: Product Password
 *         orgId:
 *           type: string
 *           description: Org Id (Note this will be set to the producters orgId)
 *         teams:
 *           type: array
 *           description: Not yet used, but will be Team IDs for AuthN purposes
 *         productType:
 *            type: string
 *            description: Org Admin, Developer, Root Admin etc.
 *         allowedActions:
 *           type: array
 *           description: Set by Product Assignments e.g. /orgs/<orgID>/write
 *       example:
 *         email: lewis@backplane.cloud
 *         password: mypassword
 */

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Organisation Products
 */

/**
 * @swagger
 * /products:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: Returns all products in the Org
 *    tags: [Product]
 *    responses:
 *      200:
 *        description: List of all products
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Product'
 *
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get the Product by ID
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
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Creates a new Product within an Organisation
 *     tags: [Product]
 *     productBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schema/Product'
 *       500:
 *         description: Server Error
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Deletes a Product by ID
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
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Updates a Product by ID
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
 *         description: The Updated Product
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
 */

/**
 * @swagger
 * /products/{id}/costs:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Product Cost
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
 *         description: The Updated Product
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
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
 *         contents:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: The Product was not found
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
} from "../controllers/productController.js";

router
  .route("/")
  .get(protect, authz, getProducts)
  .post(protect, authz, setProduct);
router
  .route("/:id")
  .get(protect, authz, getProduct)
  .put(protect, authz, updateProduct)
  .delete(protect, authz, deleteProduct);

router.route("/:id/cost").get(protect, getProductCost);
router.route("/:id/requests").get(protect, getProductRequests);

export default router;
