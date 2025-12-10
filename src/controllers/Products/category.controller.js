// src/modules/category/category.controller.js
import { categoryService } from "../../services/Products/category.service.js";
import asyncWrapper from "../../utils/asyncHandler.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

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

export const categoryController = {

  /* -------------------------------------------------------
     CREATE CATEGORY
  ---------------------------------------------------------*/
  create: asyncWrapper(async (req, res) => {
    const category = await categoryService.create(req.body);
    console.log(req.body);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Category',
      targetId: category._id,
      description: `Created category with name: ${category.name}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Category',
      description: `Fetched all categories (count: ${categories.length})`
    });

    return appResponses.success(res, { categories });
  }),

  /* -------------------------------------------------------
     GET CATEGORY BY ID
  ---------------------------------------------------------*/
  findById: asyncWrapper(async (req, res) => {
    const category = await categoryService.findById(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Category',
      targetId: category._id,
      description: `Fetched category by ID: ${category._id}`
    });

    return appResponses.success(res, { category });
  }),

  /* -------------------------------------------------------
     GET CATEGORY BY SLUG
  ---------------------------------------------------------*/
  findBySlug: asyncWrapper(async (req, res) => {
    const category = await categoryService.findBySlug(req.params.slug);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Category',
      targetId: category._id,
      description: `Fetched category by slug: ${req.params.slug}`
    });

    return appResponses.success(res, { category });
  }),

  /* -------------------------------------------------------
     UPDATE CATEGORY
  ---------------------------------------------------------*/
  update: asyncWrapper(async (req, res) => {
    const updated = await categoryService.update(req.params.id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Category',
      targetId: updated._id,
      description: `Updated category with name: ${updated.name}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Category',
      targetId: deleted._id,
      description: `Deleted category with name: ${deleted.name}`
    });

    return appResponses.success(
      res,
      { deleted },
      "Category deleted successfully / تم حذف الفئة بنجاح"
    );
  }),

};
