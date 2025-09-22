import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getBestSellers,
  getSearch,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/bestsellers", getBestSellers);
router.get("/:id/related", getRelatedProducts);
router.get("/:id", getProductById);
router.get("/search", getSearch);

export default router;
