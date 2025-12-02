import express from "express";
import { submitResponse, getResponses, getResponsePdf, getResponseDetails, downloadAllResponses, deleteResponse } from "../controllers/responseController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Important: Specific routes BEFORE parameterized routes
router.post("/:formId", submitResponse); // anyone can submit response
router.get("/download/all", authenticate, downloadAllResponses); // must be before /:formId
router.get("/pdf/:responseId", authenticate, getResponsePdf); // must be before /:formId
router.get("/details/:responseId", authenticate, getResponseDetails); // must be before /:formId
router.delete("/:responseId", authenticate, deleteResponse); // must be before /:formId
router.get("/:formId", authenticate, getResponses); // auth required to view - LAST

export default router;