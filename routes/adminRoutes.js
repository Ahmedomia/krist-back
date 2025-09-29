import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allowed origins for CORS
const allowedOrigins = [
  "https://krist-online-ecommerce-store.vercel.app",
  "http://localhost:5173",
];

// CORS configuration
router.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Async handler for uploading images
const uploadImages = async (req, res) => {
  try {
    // Wrap multer in a promise to use async/await
    await new Promise((resolve, reject) => {
      upload.fields([{ name: "image" }, { name: "image2" }])(
        req,
        res,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const files = req.files || {};
    const makeUrl = (file) => (file ? `/uploads/${file.filename}` : null);

    res.status(200).json({
      image: makeUrl(files.image?.[0]),
      image2: makeUrl(files.image2?.[0]),
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(400).json({ message: err.message || "File upload failed" });
  }
};

// Routes
router.options("/upload", (req, res) => res.sendStatus(200));
router.post("/upload", protect, admin, uploadImages);

export default router;
