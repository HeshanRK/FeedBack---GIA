import express from "express";
import { createForm, getForms, getFormById, updateForm, deleteForm } from "../controllers/formController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", authenticate, updateForm); // NEW ROUTE
router.delete("/:id", authenticate, deleteForm);

export default router;