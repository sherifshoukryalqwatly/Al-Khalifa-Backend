/* --------------------------------------------------------------------------
 * 🚦 Shipping Routes
 * - Includes authentication & admin authorization
 * - Includes validation middleware
 * -------------------------------------------------------------------------- */
import { Router } from "express";
import { shippingController } from "../../controllers/Sales/shipping.controller.js";
import { isAuthenticated, authorizeRole } from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { shippingValidation } from "../../validations/Sales/shipping.validation.js";

const router = Router();

router.use(isAuthenticated);
router.use(authorizeRole("ADMIN","SUPER_ADMIN"));

router
  .route("/")
  .post(validationMiddleware(shippingValidation.create), shippingController.create)
  .get(shippingController.findAll);

router
  .route("/:id")
  .get(shippingController.findById)
  .patch(validationMiddleware(shippingValidation.update), shippingController.update)
  .delete(shippingController.delete);

export default router;
