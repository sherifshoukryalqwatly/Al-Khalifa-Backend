/* --------------------------------------------------------------------------
 * 🚦 Banner Routes
 * - Includes authentication & admin authorization
 * - Includes validation middleware
 * -------------------------------------------------------------------------- */

import { Router } from "express";
import { bannerController } from "../../controllers/System/banner.controller.js";
import { isAuthenticated, authorizeRole } from "../../middlewares/auth.middleware.js";
import  validationMiddleware  from "../../middlewares/validation.middleware.js";
import { bannerValidation } from "../../validations/System/banner.validation.js";
import upload from "../../config/multer.config.js";

const router = Router();

router.use(isAuthenticated);

router
  .route("/")
  .post(
    authorizeRole("ADMIN", "SUPER_ADMIN"),
    upload.single("image"),
    validationMiddleware(bannerValidation.create),
    bannerController.create
  )
  .get(bannerController.findAll);

router
  .route("/:id")
  .get(bannerController.findById)
  .patch(
    authorizeRole("ADMIN", "SUPER_ADMIN"),
    upload.single("image"),
    validationMiddleware(bannerValidation.update),
    bannerController.update
  )
  .delete(
    authorizeRole("ADMIN", "SUPER_ADMIN"),
    bannerController.delete
  );


export default router;
