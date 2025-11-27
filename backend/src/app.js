import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import formRoutes from "./routes/formRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import responseRoutes from "./routes/responseRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/responses", responseRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Serve frontend static files
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Handle React Router - send all non-API requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

export default app;