import * as productService from '../../services/Products/product.service.js';
import asyncWrapper from '../../utils/asyncHandler.js';
import { appResponses } from '../../utils/AppResponses.js';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
import AppErrors from '../../utils/AppErrors.js';

// -------------------- CREATE PRODUCT --------------------
export const create = asyncWrapper(async (req, res) => {
  const uploadedImages = [];

  // Upload files to Cloudinary if provided
  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const image = await uploadToCloudinary(file, "products");
      uploadedImages.push(image.secure_url);
    }
  }

  // Add uploaded images to product data
  const productData = {
      title: {
      en: req.body['title.en'],
      ar: req.body['title.ar']
    },
    description: {
      en: req.body['description.en'],
      ar: req.body['description.ar']
    },
    ...req.body,
    images: uploadedImages
  }

  

  const product = await productService.create(productData);

  return appResponses.success(
    res,
    product,
    'Product Created Successfully / تم إنشاء المنتج بنجاح',
    201
  );
});

// -------------------- UPDATE PRODUCT --------------------
export const update = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  // Upload new files if provided and append to existing images
  if (req.files && req.files.length > 0) {
    const uploadedImages = [];
    for (let file of req.files) {
      const image = await uploadToCloudinary(file, "products");
      uploadedImages.push(image.secure_url);
    }

    // Merge with existing images if you want to keep old ones
    const product = await productService.findById(id);
    updatedData.images = [...(product.images || []), ...uploadedImages];
  }

  const updatedProduct = await productService.update(id, updatedData);

  return appResponses.success(
    res,
    updatedProduct,
    'Product Updated Successfully / تم تعديل المنتج بنجاح'
  );
});

// -------------------- FIND BY ID --------------------
export const findById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const product = await productService.findById(id);
  return appResponses.success(
    res,
    product,
    'Product Retrieved Successfully / تم استرداد المنتج بنجاح'
  );
});

// -------------------- FIND PRODUCT BY TITLE --------------------
export const findByTitle = asyncWrapper(async (req, res) => {
  const { title } = req.query; // send as ?title=...
  if (!title) {
    throw AppErrors.badRequest("Product title is required / عنوان المنتج مطلوب");
  }

  const product = await productService.findByTitle(title);

  return appResponses.success(
    res,
    product,
    'Product Retrieved Successfully / تم استرداد المنتج بنجاح'
  );
});

// -------------------- FIND ALL --------------------
export const findAll = asyncWrapper(async (req, res) => {
  const { query } = req;
  const { products, total } = await productService.findAll(
    query.filters,
    query.sort,
    query.pagination
  );
  return appResponses.success(
    res,
    { data: products, total },
    'Products Retrieved Successfully / تم استرداد المنتجات بنجاح'
  );
});

// -------------------- HARD DELETE --------------------
export const hRemove = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await productService.hRemove(id);
  return appResponses.success(
    res,
    null,
    'Product Deleted Successfully / تم حذف المنتج بنجاح'
  );
});

// -------------------- SOFT DELETE --------------------
export const remove = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await productService.remove(id);
  return appResponses.success(
    res,
    null,
    'Product Deleted Successfully / تم حذف المنتج بنجاح'
  );
});

// -------------------- HARD DELETE ALL --------------------
export const hRemoveAll = asyncWrapper(async (req, res) => {
  const { ids } = req.body;
  await productService.hRemoveAll(ids);
  return appResponses.success(
    res,
    null,
    'Products Deleted Successfully / تم حذف المنتجات بنجاح'
  );
});

// -------------------- SOFT DELETE ALL --------------------
export const removeAll = asyncWrapper(async (req, res) => {
  const { ids } = req.body;
  await productService.removeAll(ids);
  return appResponses.success(
    res,
    null,
    'Products Deleted Successfully / تم حذف المنتجات بنجاح'
  );
});
