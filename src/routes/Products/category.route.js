import { Router } from "express";
import { categoryController } from "../../controllers/Products/category.controller.js";
import { isAuthenticated ,authorizeRole } from "../../middlewares/auth.middleware.js";
import  validationMiddleware  from "../../middlewares/validation.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../../validations/Products/category.validation.js";

const router = Router();

/* -------------------------------------------------------
   PUBLIC ROUTES
---------------------------------------------------------*/

// Get all categories
router.get("/", categoryController.findAll);

// Get category by slug
router.get("/slug/:slug", categoryController.findBySlug);

// Get category by id
router.get("/:id", categoryController.findById);

/* -------------------------------------------------------
   PROTECTED ROUTES (ADMIN ONLY)
---------------------------------------------------------*/

router.use(isAuthenticated);
router.use(authorizeRole("ADMIN", "SUPER_ADMIN"));

/* CREATE CATEGORY */
router.post(
  "/",
  validationMiddleware(createCategorySchema),
  categoryController.create
);
/* UPDATE CATEGORY */
router.patch(
  "/:id",
  validationMiddleware(updateCategorySchema),
  categoryController.update
);

/* DELETE CATEGORY (SOFT DELETE) */
router.delete("/:id", categoryController.remove);

export default router;
