import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import subscribeRoutes from "./routes/subscribeRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://krist-online-ecommerce-store.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content",
      "Accept",
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/subscribe", subscribeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
