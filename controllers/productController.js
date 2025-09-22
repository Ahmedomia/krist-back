import Product from "../models/Product.js";
import { z } from "zod";
import mongoose from "mongoose";

const idSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  });

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    idSchema.parse(req.params.id);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    idSchema.parse(id);

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json(related);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    console.error("Error fetching related products:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ rating: -1 }).limit(8);

    res.json(bestSellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    let query = {};

    if (search.trim() !== "") {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      };
    }

    const products = await Product.find(query).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

