import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  getProfile,
  updateProfile,
  
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const uploadsDir = path.join(dirname, "..", "..", "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });
// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase();

    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`);
  },
});
// File filter and size limit
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router = Router();

router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, upload.single("photo"), updateProfile);

export default router;
