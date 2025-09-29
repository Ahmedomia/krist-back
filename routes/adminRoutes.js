import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import fs from "fs";

const router = express.Router();


// Users
router.get("/users", protect, admin, async (req, res) => {
  const users = await User.find().select(
    "name email isAdmin createdAt blocked lastLogin"
  );
  res.json(users);
});

router.put("/users/:id/toggle-admin", protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json({ _id: user._id, isAdmin: user.isAdmin });
});

router.put("/users/:id/block", protect, admin, async (req, res) => {
  // Simple soft-block via a flag added ad-hoc
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { blocked: true } },
    { new: true }
  ).select("_id blocked");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.put("/users/:id/unblock", protect, admin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { blocked: false } },
    { new: true }
  ).select("_id blocked");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Orders
router.get("/orders", protect, admin, async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json(orders);
});

router.put("/orders/:id/status", protect, admin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// Products (basic CRUD)
router.post("/products", protect, admin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put("/products/:id", protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.delete("/products/:id", protect, admin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ success: true });
});

// Stock management
router.put("/products/:id/stock", protect, admin, async (req, res) => {
  const { stock } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: { stock } },
    { new: true }
  );
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});



export default router;
