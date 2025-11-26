import express from "express";
import { guestLogin, internalLogin } from "../controllers/visitorController.js";

const router = express.Router();

router.post("/guest", guestLogin);
router.post("/internal", internalLogin);

export default router;
