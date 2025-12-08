// ==========================================
// 🔹 PAYMENT ROUTES
// ==========================================
import express from "express";
import { paymentController } from "../../controllers/Sales/payment.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js"
import { createPaymentSchema, updatePaymentSchema } from "../../validations/Sales/payment.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// Create Payment
router.post("/", validationMiddleware(createPaymentSchema), paymentController.createPayment);

// Get My Payments (logged-in user)
router.get("/my-payments", paymentController.getMyPayments);

// Get Payment by ID
router.get("/:id", paymentController.getPaymentById);

// Update Payment
router.patch("/:id", validationMiddleware(updatePaymentSchema), paymentController.updatePayment);

// Delete Payment
router.delete("/:id", paymentController.deletePayment);

// List All Payments (admin)
router.get("/", paymentController.listPayments);

export default router;
