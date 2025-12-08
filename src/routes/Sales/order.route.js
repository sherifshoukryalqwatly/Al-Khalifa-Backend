// ==========================================
// 🔹 ORDER ROUTES
// ==========================================
import express from "express";
import { orderController } from "../../controllers/Sales/order.controller.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {isAuthenticated} from "../../middlewares/auth.middleware.js";
import { createOrderSchema, updateOrderSchema } from "../../validations/Sales/order.validation.js";

const router = express.Router();

router.use(isAuthenticated);

// Create Order
router.post("/", validationMiddleware(createOrderSchema), orderController.createOrder);

// Get My Orders (logged-in user)
router.get("/my-orders", orderController.getMyOrders);

// Get Order by ID
router.get("/:id", orderController.getOrderById);

// Update Order (status or info)
router.patch("/:id", validationMiddleware(updateOrderSchema), orderController.updateOrder);

// Delete Order
router.delete("/:id", orderController.deleteOrder);

// List All Orders (admin)
router.get("/", orderController.listOrders);

export default router;
