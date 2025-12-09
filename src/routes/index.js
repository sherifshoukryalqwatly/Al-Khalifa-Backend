import express from "express";

// Import all your route files
import authRoutes from "../auth/auth.route.js";
import userRoutes from "./Users/user.route.js";
import productRoute from "./Products/product.route.js";
import categoryRoute from "./Products/category.route.js";
import reviewRoute from "./Products/review.route.js";
import wishlistRoute from "./Products/wishlist.route.js";
import cartRoute from "./Sales/cart.route.js";
import couponRoute from "./Sales/coupon.route.js";
import orderRoute from "./Sales/order.route.js";
import paymentRoute from "./Sales/payment.route.js";
import refundRoute from "./Sales/refund.route.js";
import auditlogRoute from "./System/auditlog.route.js";
import bannerRoute from "./System/banner.route.js";
import notificationRoute from "./System/notification.route.js";

const router = express.Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/reviews", reviewRoute);
router.use("/wishlist", wishlistRoute);
router.use("/cart", cartRoute);
router.use("/coupon", couponRoute);
router.use("/order", orderRoute);
router.use("/payment", paymentRoute);
router.use("/refund", refundRoute);
router.use("/auditlog", auditlogRoute);
router.use("/banner", bannerRoute);
router.use("/notifications", notificationRoute);

// Default route for API health check
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;