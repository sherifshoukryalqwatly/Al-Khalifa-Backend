/* --------------------------------------------------------------------------
 * 🚦 Notification Routes
 * - Includes authentication & admin authorization if needed
 * - Includes validation middleware
 * -------------------------------------------------------------------------- */

import { Router } from "express";
import { notificationController } from "../../controllers/System/notification.controller.js";
import { isAuthenticated, authorizeRole } from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import { notificationValidation } from "../../validations/System/notification.validation.js";

const router = Router();

router.use(isAuthenticated);

router
  .route("/")
  .post(
    validationMiddleware(notificationValidation.create),
    notificationController.create
  )
  .get(notificationController.findAllByUser);

router
  .route("/:id")
  .get(notificationController.findById)
  .patch(
    validationMiddleware(notificationValidation.update),
    notificationController.update
  );

router
  .route("/read/:id")
  .patch(notificationController.markAsRead);

router
  .route("/delete/:id")
  .delete(notificationController.delete);

export default router;
