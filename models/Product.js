import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  category: String,
  subcategory: String,
  price: Number,
  oldPrice: Number,
  colors: [String],
  sizes: [String],
  inStockSizes: [String],
  image: String,
  image2: String,
  rating: Number,
  reviews: Number,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

export default Product;
