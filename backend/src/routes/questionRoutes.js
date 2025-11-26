import express from "express";
import { addQuestion, updateQuestion, deleteQuestion } from "../controllers/questionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:formId", authenticate, addQuestion);
router.put("/:id", authenticate, updateQuestion);
router.delete("/:id", authenticate, deleteQuestion);

export default router;
