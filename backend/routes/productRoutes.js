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
