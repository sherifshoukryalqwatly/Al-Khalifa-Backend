/* --------------------------------------------------------------------------
 * 🚦 Inventory Routes
 * - Includes authentication & admin authorization
 * - Includes validation middleware
 * -------------------------------------------------------------------------- */
import { Router } from "express";
import { inventoryController } from "../../controllers/Sales/inventory.controller.js";
import { isAuthenticated, authorizeRole } from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { inventoryValidation } from "../../validations/Sales/inventory.validation.js";

const router = Router();

router.use(isAuthenticated);
router.use(authorizeRole("ADMIN","SUPER_ADMIN"));

router
  .route("/")
  .post(validationMiddleware(inventoryValidation.create), inventoryController.create)
  .get(inventoryController.findAll);

router
  .route("/:id")
  .get(inventoryController.findById)
  .patch(validationMiddleware(inventoryValidation.update), inventoryController.update)
  .delete(inventoryController.delete);

export default router;
