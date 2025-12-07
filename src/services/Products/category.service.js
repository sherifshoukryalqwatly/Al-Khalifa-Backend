import { categoryRepo } from "../../repo/Products/category.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const categoryService = {
  /* -------------------------------------------------------
     CREATE CATEGORY
  ---------------------------------------------------------*/
  create: async (data) => {
    // Check name exist (Arabic or English)
    const exists = await categoryRepo.findByName(data.name?.en);

    if (exists)
      throw AppErrors.badRequest(
        "Category already exists / الفئة موجودة بالفعل"
      );

    return categoryRepo.create(data);
  },

  /* -------------------------------------------------------
     GET ALL CATEGORIES
  ---------------------------------------------------------*/
  findAll: async () => {
    return categoryRepo.findAll();
  },

  /* -------------------------------------------------------
     GET SINGLE CATEGORY BY ID
  ---------------------------------------------------------*/
  findById: async (id) => {
    const category = await categoryRepo.findById(id);

    if (!category)
      throw AppErrors.notFound("Category not found / الفئة غير موجودة");

    return category;
  },

  /* -------------------------------------------------------
     GET CATEGORY BY SLUG (AR or EN)
  ---------------------------------------------------------*/
  findBySlug: async (slug) => {
    const category = await categoryRepo.findBySlug(slug);

    if (!category)
      throw AppErrors.notFound("Category not found / الفئة غير موجودة");

    return category;
  },

  /* -------------------------------------------------------
     UPDATE CATEGORY
  ---------------------------------------------------------*/
  update: async (id, data) => {
    const updated = await categoryRepo.updateById(id, data);

    if (!updated)
      throw AppErrors.notFound("Category not found / الفئة غير موجودة");

    return updated;
  },

  /* -------------------------------------------------------
     SOFT DELETE CATEGORY
  ---------------------------------------------------------*/
  remove: async (id, deletedBy) => {
    const deleted = await categoryRepo.softDelete(id, deletedBy);

    if (!deleted)
      throw AppErrors.notFound("Category not found / الفئة غير موجودة");

    return deleted;
  },
};
