import * as productRepo from "../../repo/Products/product.repo.js";
import AppErrors from "../../utils/AppErrors.js";
import { productFilters, productSort, productPagination } from "../../utils/product_filter_sort.js";

/* -------------------------------------------------------
   CREATE PRODUCT
---------------------------------------------------------*/
export const create = async (data) => {
  const requiredFields = ["title", "description", "category", "brand", "price", "gender", "images"];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      throw AppErrors.badRequest(`${field} is required / ${field} مطلوب`);
    }
  });

  if (data.price < 0) {
    throw AppErrors.badRequest("Price must be positive / السعر يجب أن يكون موجبًا");
  }

  if (data.discount && (data.discount < 0 || data.discount > 100)) {
    throw AppErrors.badRequest("Invalid discount / نسبة الخصم خطأ");
  }

  const product = await productRepo.create(data);
  return product;
};

/* -------------------------------------------------------
   FIND BY ID
---------------------------------------------------------*/
export const findById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw AppErrors.badRequest("Invalid Product Id / معرف المنتج خطأ");
  }

  const product = await productRepo.findById(id);
  if (!product) throw AppErrors.notFound("Product not Found / المنتج غير موجود");

  return product;
};

/* -------------------------------------------------------
   FIND BY TITLE (EN or AR)
---------------------------------------------------------*/
export const findByTitle = async (title) => {
  if (!title)
    throw AppErrors.badRequest("Product title is required / عنوان المنتج مطلوب");

  const product = await productRepo.findByTitle(title);

  if (!product) throw AppErrors.notFound("Product not Found / المنتج غير موجود");

  return product;
};

/* -------------------------------------------------------
   FIND ALL (Filters + Sort + Pagination)
---------------------------------------------------------*/
export const findAll = async (query = {}) => {
  const filters = productFilters(query);
  const sort = productSort(query);
  const pagination = productPagination(query);

  const { products, total } = await productRepo.findAll(filters, sort, pagination);
  const pages = Math.ceil(total / (pagination.limit || total));

  return { products, total, pages };
};

/* -------------------------------------------------------
   UPDATE PRODUCT
---------------------------------------------------------*/
export const update = async (id, newData) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw AppErrors.badRequest("Invalid Product Id / معرف المنتج خطأ");
  }

  if (newData.price && newData.price < 0) {
    throw AppErrors.badRequest("Price must be positive / السعر يجب أن يكون موجبًا");
  }

  if (newData.discount && (newData.discount < 0 || newData.discount > 100)) {
    throw AppErrors.badRequest("Invalid discount / نسبة الخصم خطأ");
  }

  const existingProduct = await productRepo.findById(id);
  if (!existingProduct)
    throw AppErrors.notFound("Product not Found / المنتج غير موجود");

  return await productRepo.update(id, newData);
};

/* -------------------------------------------------------
   HARD DELETE PRODUCT
---------------------------------------------------------*/
export const hRemove = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) throw AppErrors.notFound("Product not Found / المنتج غير موجود");

  await productRepo.hRemove(id);

  return { message: "Product deleted Successfully / تم حذف المنتج بنجاح" };
};

/* -------------------------------------------------------
   SOFT DELETE PRODUCT
---------------------------------------------------------*/
export const remove = async (id, adminId) => {
  const product = await productRepo.findById(id);
  if (!product) throw AppErrors.notFound("Product not Found / المنتج غير موجود");

  await productRepo.remove(id, adminId);

  return { message: "Product deleted Successfully / تم حذف المنتج بنجاح" };
};

/* -------------------------------------------------------
   HARD DELETE MANY PRODUCTS
---------------------------------------------------------*/
export const hRemoveAll = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw AppErrors.badRequest("IDs array is required / مصفوفة المعرفات مطلوبة");
  }

  const validIds = ids.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));

  const result = await productRepo.hRemoveAll(validIds);

  return {
    message: `${result.deletedCount} Products deleted Successfully / تم حذف المنتجات بنجاح`,
  };
};

/* -------------------------------------------------------
   SOFT DELETE MANY PRODUCTS
---------------------------------------------------------*/
export const removeAll = async (ids, adminId) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw AppErrors.badRequest("IDs array is required / مصفوفة المعرفات مطلوبة");
  }

  const validIds = ids.filter((id) => id.match(/^[0-9a-fA-F]{24}$/));

  const result = await productRepo.removeAll(validIds, adminId);

  return {
    message: `${result.deletedCount} Products deleted Successfully / تم حذف المنتجات بنجاح`,
  };
};
