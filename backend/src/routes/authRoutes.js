import express from "express";
import { login, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", authenticate, adminOnly, register);

export default router;