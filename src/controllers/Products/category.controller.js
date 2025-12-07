// src/modules/category/category.controller.js
import { categoryService } from "../../services/Products/category.service.js";
import asyncWrapper from "../../utils/asyncHandler.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const categoryController = {

  /* -------------------------------------------------------
     CREATE CATEGORY
  ---------------------------------------------------------*/
  create: asyncWrapper(async (req, res) => {
    const category = await categoryService.create(req.body);
    console.log(req.body);
    

    return appResponses.success(
      res,
      { category },
      "Category created successfully / تم إنشاء الفئة بنجاح",
      StatusCodes.CREATED
    );
  }),

  /* -------------------------------------------------------
     GET ALL CATEGORIES
  ---------------------------------------------------------*/
  findAll: asyncWrapper(async (req, res) => {
    const categories = await categoryService.findAll();

    return appResponses.success(res, { categories });
  }),

  /* -------------------------------------------------------
     GET CATEGORY BY ID
  ---------------------------------------------------------*/
  findById: asyncWrapper(async (req, res) => {
    const category = await categoryService.findById(req.params.id);

    return appResponses.success(res, { category });
  }),

  /* -------------------------------------------------------
     GET CATEGORY BY SLUG
  ---------------------------------------------------------*/
  findBySlug: asyncWrapper(async (req, res) => {
    const category = await categoryService.findBySlug(req.params.slug);

    return appResponses.success(res, { category });
  }),

  /* -------------------------------------------------------
     UPDATE CATEGORY
  ---------------------------------------------------------*/
  update: asyncWrapper(async (req, res) => {
    const updated = await categoryService.update(req.params.id, req.body);

    return appResponses.success(
      res,
      { updated },
      "Category updated successfully / تم تحديث الفئة بنجاح"
    );
  }),

  /* -------------------------------------------------------
     SOFT DELETE CATEGORY
  ---------------------------------------------------------*/
  remove: asyncWrapper(async (req, res) => {
    const deleted = await categoryService.remove(req.params.id, req.user?._id);

    return appResponses.success(
      res,
      { deleted },
      "Category deleted successfully / تم حذف الفئة بنجاح"
    );
  }),

};
