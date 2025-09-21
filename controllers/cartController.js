import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { z } from "zod";
import mongoose from "mongoose";

const addCartSchema = z.object({
  product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be positive"),
  image: z.string().url("Image must be a valid URL"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().min(1, "Size is required"),
});

const removeCartSchema = z.object({
  id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid cart item ID",
  }),
});

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product"
  );
  res.json(cart || { cartItems: [] });
};

export const addToCart = async (req, res) => {
  try {
    const schema = z.object({
      product: z
        .string()
        .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: "Invalid product ID",
        }),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      size: z.string().min(1, "Size is required"),
    });

    const { product, quantity, size } = schema.parse(req.body);

    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, cartItems: [] });

    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === product && item.size === size
    );

    if (existingItemIndex >= 0) {
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        product,
        name: productDoc.name,
        price: productDoc.price,
        image: productDoc.image,
        quantity,
        size,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    removeCartSchema.parse({ id: req.params.id });

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.cartItems = cart.cartItems.filter(
      (item) => item._id.toString() !== req.params.id
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: error.message });
  }
};
