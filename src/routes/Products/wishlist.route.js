// src/modules/wishlist/wishlist.routes.js
import { Router } from "express";
import { wishlistController } from "../../controllers/Products/wishlist.controller.js";
import { isAuthenticated ,authorizeRole } from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { addProductsSchema, removeProductsSchema } from "../../validations/Products/wishlist.validation.js";

const router = Router();

/* --------------------- PROTECTED ROUTES --------------------- */
router.use(isAuthenticated);
router.use(authorizeRole("ADMIN", "SUPER_ADMIN", "USER"));

// Create wishlist
router.post("/", wishlistController.create);

// Get wishlist for user
router.get("/", wishlistController.getByUser);

// Add products
router.patch("/add-products", validationMiddleware(addProductsSchema), wishlistController.addProducts);

// Remove products
router.patch("/remove-products", validationMiddleware(removeProductsSchema), wishlistController.removeProducts);

// Delete wishlist
router.delete("/", wishlistController.delete);

export default router;
