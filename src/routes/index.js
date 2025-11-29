import express from "express";

// Import all your route files
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import uploadRoutes from "./upload.route.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;