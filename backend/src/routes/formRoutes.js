import express from "express";
import { createForm, getForms, getFormById, deleteForm } from "../controllers/formController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.delete("/:id", authenticate, deleteForm);

export default router;