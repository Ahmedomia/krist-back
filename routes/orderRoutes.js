import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addOrder, getOrderById } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, addOrder);
router.get("/:id", protect, getOrderById);

export default router;
