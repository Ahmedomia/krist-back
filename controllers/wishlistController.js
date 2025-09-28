import Wishlist from "../models/Wishlist.js";
import { z } from "zod";
import mongoose from "mongoose";

const wishlistSchema = z.object({
  productId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid product ID",
  }),
});

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate(
      "productId"
    );
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = wishlistSchema.parse(req.params);

    const item = await Wishlist.findOne({ userId: req.user._id, productId });
    if (item) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const newItem = new Wishlist({ userId: req.user._id, productId });
    await newItem.save();

    res.json(newItem);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res
      .status(500)
      .json({ message: "Failed to add to wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userId: req.user._id,
      productId: req.params.productId,
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove from wishlist", error: err.message });
  }
};
