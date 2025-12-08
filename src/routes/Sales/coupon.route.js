// ==========================================
// 🔹 COUPON ROUTES
// ==========================================
import express from "express";
import { couponController } from "../../controllers/Sales/coupone.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";
import { createCouponSchema, applyCouponSchema, updateCouponSchema } from "../../validations/Sales/coupon.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// Create Coupon
router.post("/", validationMiddleware(createCouponSchema), couponController.createCoupon);

// Get Coupon by Code
router.get("/:code", couponController.getCouponByCode);

// Apply Coupon to Cart
router.post("/apply", validationMiddleware(applyCouponSchema), couponController.applyCoupon);

// Update Coupon
router.patch("/:id", validationMiddleware(updateCouponSchema), couponController.updateCoupon);

// Delete Coupon
router.delete("/:id", couponController.deleteCoupon);

// List All Coupons
router.get("/", couponController.listCoupons);

export default router;
