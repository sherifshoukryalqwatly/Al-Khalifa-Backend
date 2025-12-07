// src/modules/review/review.routes.js
import { Router } from "express";
import { reviewController } from "../../controllers/Products/review.controller.js";
import { isAuthenticated ,authorizeRole } from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../../validations/Products/review.validtion.js";

const router = Router();

/* --------------------- PUBLIC ROUTES --------------------- */
// List all reviews
router.get("/", reviewController.findAll);

// Get review by ID
router.get("/:id", reviewController.findById);

/* --------------------- PROTECTED ROUTES --------------------- */
router.use(isAuthenticated);
router.use(authorizeRole("ADMIN", "SUPER_ADMIN", "USER"));

// Create review
router.post("/", validationMiddleware(createReviewSchema), reviewController.create);

// Update review
router.patch("/:id", validationMiddleware(updateReviewSchema), reviewController.update);

// Soft delete review
router.delete("/:id", reviewController.remove);

export default router;
