import express from "express";
import { submitResponse, getResponses, getResponsePdf } from "../controllers/responseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:formId", submitResponse); // anyone can submit response
router.get("/:formId", authenticate, getResponses); // auth required to view
router.get("/pdf/:responseId", authenticate, getResponsePdf); // auth required

export default router;
