import * as productService from '../../services/Products/product.service.js';
import asyncWrapper from '../../utils/asyncHandler.js';
import { appResponses } from '../../utils/AppResponses.js';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary.js';
import AppErrors from '../../utils/AppErrors.js';
import { auditLogService } from '../../services/System/auditlog.service.js';

// Helper for audit logs
const logAction = async ({ req, user, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: user?._id || user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null
  });
};

// -------------------- CREATE PRODUCT --------------------
export const create = asyncWrapper(async (req, res) => {
  const uploadedImages = [];

  if (req.files && req.files.length > 0) {
    for (let file of req.files) {
      const image = await uploadToCloudinary(file, "products");
      uploadedImages.push(image.secure_url);
    }
  }

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
  };

  const product = await productService.create(productData);

  await logAction({
    req,
    user: req.user,
    action: 'CREATE',
    targetModel: 'Product',
    targetId: product._id,
    description: `Created product with title: ${product.title.en}`
  });

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

  if (req.files && req.files.length > 0) {
    const uploadedImages = [];
    for (let file of req.files) {
      const image = await uploadToCloudinary(file, "products");
      uploadedImages.push(image.secure_url);
    }

    const product = await productService.findById(id);
    updatedData.images = [...(product.images || []), ...uploadedImages];
  }

  const updatedProduct = await productService.update(id, updatedData);

  await logAction({
    req,
    user: req.user,
    action: 'UPDATE',
    targetModel: 'Product',
    targetId: updatedProduct._id,
    description: `Updated product with title: ${updatedProduct.title.en}`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'READ',
    targetModel: 'Product',
    targetId: product._id,
    description: `Fetched product with title: ${product.title.en}`
  });

  return appResponses.success(
    res,
    product,
    'Product Retrieved Successfully / تم استرداد المنتج بنجاح'
  );
});

// -------------------- FIND PRODUCT BY TITLE --------------------
export const findByTitle = asyncWrapper(async (req, res) => {
  const { title } = req.query;
  if (!title) {
    throw AppErrors.badRequest("Product title is required / عنوان المنتج مطلوب");
  }

  const product = await productService.findByTitle(title);

  await logAction({
    req,
    user: req.user,
    action: 'READ',
    targetModel: 'Product',
    targetId: product._id,
    description: `Fetched product by title: ${product.title.en}`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'READ',
    targetModel: 'Product',
    description: `Fetched all products (count: ${products.length})`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'DELETE',
    targetModel: 'Product',
    targetId: id,
    description: `Hard deleted product with id: ${id}`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'DELETE',
    targetModel: 'Product',
    targetId: id,
    description: `Soft deleted product with id: ${id}`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'DELETE',
    targetModel: 'Product',
    description: `Hard deleted multiple products (count: ${ids.length})`
  });

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

  await logAction({
    req,
    user: req.user,
    action: 'DELETE',
    targetModel: 'Product',
    description: `Soft deleted multiple products (count: ${ids.length})`
  });

  return appResponses.success(
    res,
    null,
    'Products Deleted Successfully / تم حذف المنتجات بنجاح'
  );
});
