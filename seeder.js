import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import allProducts from "../krist-front/src/data/products.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"))
  .catch((err) => console.error(err));

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(allProducts);
    console.log("✅ Data Imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

importData();
