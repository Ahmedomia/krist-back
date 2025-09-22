import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id }).populate(
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
    const { productId } = req.params;
    const item = await Wishlist.findOne({ userId: req.user.id, productId });

    if (item) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const newItem = new Wishlist({ userId: req.user.id, productId });
    await newItem.save();

    res.json(newItem);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add to wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      userId: req.user.id,
      productId: req.params.productId,
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove from wishlist", error: err.message });
  }
};
