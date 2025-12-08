// ==========================================
// 🔹 REFUND ROUTES
// ==========================================
import express from "express";
import { refundController } from "../../controllers/Sales/refund.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";
import { createRefundSchema, updateRefundSchema } from "../../validations/Sales/refund.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// Create Refund
router.post("/", validationMiddleware(createRefundSchema), refundController.createRefund);

// Get My Refunds
router.get("/my-refunds", refundController.getMyRefunds);

// Get Refund by ID
router.get("/:id", refundController.getRefundById);

// Update Refund
router.patch("/:id", validationMiddleware(updateRefundSchema), refundController.updateRefund);

// Delete Refund
router.delete("/:id", refundController.deleteRefund);

// List All Refunds (Admin)
router.get("/", refundController.listRefunds);

export default router;
