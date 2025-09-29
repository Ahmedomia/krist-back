import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

const allowedOrigins = [
  "https://krist-online-ecommerce-store.vercel.app",
  "http://localhost:5173",
];

const uploadCors = cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

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

router.options("/upload", uploadCors, (req, res) => res.sendStatus(200));

router.post("/upload", uploadCors, protect, admin, (req, res) => {
  upload.fields([{ name: "image" }, { name: "image2" }])(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });

    const files = req.files || {};
    const makeUrl = (file) => (file ? `/uploads/${file.filename}` : null);

    res.json({
      image: makeUrl(files.image?.[0]),
      image2: makeUrl(files.image2?.[0]),
    });
  });
});

export default router;
