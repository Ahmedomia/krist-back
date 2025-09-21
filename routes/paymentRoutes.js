import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addPayment, getPayments } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", protect, addPayment);
router.get("/", protect, getPayments);

export default router;
