import express from "express";
import {
  signup,
  login,
  getUserProfile,
} from "../controllers/authController.js";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/FPassController.js";
import { updateUserProfile } from "../controllers/updateUserProfile.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
