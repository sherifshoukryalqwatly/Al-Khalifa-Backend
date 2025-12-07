import express from "express";

// Import all your route files
import authRoutes from "../auth/auth.route.js";
import userRoutes from "./Users/user.route.js";
import uploadRoutes from "./System/upload.route.js";
import productRoute from "./Products/product.route.js";
import categoryRoute from "./Products/category.route.js";
import reviewRoute from "./Products/review.route.js";
import wishlistRoute from "./Products/wishlist.route.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/reviews", reviewRoute);
router.use("/wishlist", wishlistRoute);

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;