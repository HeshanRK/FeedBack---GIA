import express from "express";
import { 
  createForm, 
  getForms, 
  getFormById, 
  updateForm, 
  deleteForm,
  setActiveGuest,
  setActiveInternal,
  getActiveForm
} from "../controllers/formController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", authenticate, updateForm);
router.delete("/:id", authenticate, deleteForm);

// NEW: Active form management
router.post("/:id/set-active-guest", authenticate, setActiveGuest);
router.post("/:id/set-active-internal", authenticate, setActiveInternal);
router.get("/active/:visitorType", getActiveForm); // No auth needed - visitors need this

export default router;