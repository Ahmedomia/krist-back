import express from "express";
import {
  getAddresses,
  addAddress,
  editAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAddresses);
router.post("/", addAddress);
router.put("/:id", editAddress);
router.delete("/:id", deleteAddress);

export default router;
