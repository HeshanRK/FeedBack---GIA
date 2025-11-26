import express from "express";
import rateLimit from "express-rate-limit";
import { login, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, login);
// register endpoint protected by authenticate + adminOnly
router.post("/register", authenticate, adminOnly, register);

export default router;