import { Router } from 'express';
import * as productController from '../../controllers/Products/product.controller.js';
import validationMiddleware from '../../middlewares/validation.middleware.js';
import { createProductSchema, updateProductSchema, deleteManySchema } from '../../validations/Products/product.validation.js';
import { authorizeRole, isAuthenticated } from "../../middlewares/auth.middleware.js";
import upload from "../../config/multer.config.js"; // Multer config

const router = Router();

// ===============================
// 📌 PRODUCT ROUTES
// ===============================

// CREATE PRODUCT
// @route   POST /products/
// @access  ADMIN, SUPER_ADMIN
router
  .route('/')
  .post(
    isAuthenticated,
    authorizeRole('ADMIN', 'SUPER_ADMIN'),
    upload.array('images', 5), // ✅ Multer for multiple images
    validationMiddleware(createProductSchema),
    productController.create
  )
  // FIND ALL PRODUCTS
  // @route   GET /products/
  // @access  PUBLIC
  .get(productController.findAll);

// -------------------- SEARCH PRODUCT BY TITLE --------------------
// @route   GET /products/search?title=someTitle
// @access  PUBLIC
router.get('/search', productController.findByTitle);

// FIND PRODUCT BY ID
// @route   GET /products/:id
// @access  PUBLIC
router
  .route('/:id')
  .get(productController.findById)
  // UPDATE PRODUCT
  // @route   PATCH /products/:id
  // @access  ADMIN, SUPER_ADMIN
  .patch(
    isAuthenticated,
    authorizeRole('ADMIN', 'SUPER_ADMIN'),
    upload.array('images', 5), // ✅ Multer for multiple images on update
    validationMiddleware(updateProductSchema),
    productController.update
  )
  // HARD DELETE PRODUCT
  // @route   DELETE /products/:id
  // @access  ADMIN, SUPER_ADMIN
  .delete(
    isAuthenticated,
    authorizeRole('ADMIN', 'SUPER_ADMIN'),
    productController.hRemove
  );

// SOFT DELETE PRODUCT
// @route   PATCH /products/remove/:id
// @access  ADMIN, SUPER_ADMIN
router.patch(
  '/remove/:id',
  isAuthenticated,
  authorizeRole('ADMIN', 'SUPER_ADMIN'),
  productController.remove
);

// HARD DELETE MANY PRODUCTS
// @route   DELETE /products/
// @access  ADMIN, SUPER_ADMIN
router.delete(
  '/',
  isAuthenticated,
  authorizeRole('ADMIN', 'SUPER_ADMIN'),
  validationMiddleware(deleteManySchema),
  productController.hRemoveAll
);

// SOFT DELETE MANY PRODUCTS
// @route   PATCH /products/
// @access  ADMIN, SUPER_ADMIN
router.patch(
  '/',
  isAuthenticated,
  authorizeRole('ADMIN', 'SUPER_ADMIN'),
  validationMiddleware(deleteManySchema),
  productController.removeAll
);

export default router;
