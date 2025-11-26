import express from "express";
import { createForm, getForms, getFormById } from "../controllers/formController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createForm); // only authenticated users can create forms
router.get("/", getForms);
router.get("/:id", getFormById);

export default router;
