/* --------------------------------------------------------------------------
 * 🎮 Inventory Controller (HTTP Layer)
 * - Handles express req/res
 * - Delegates logic to service layer
 * - Sends formatted responses
 * -------------------------------------------------------------------------- */
import asyncWrapper from "../../utils/asyncHandler.js";
import { inventoryService } from "../../services/Sales/inventory.service.js";
import { appResponses } from "../../utils/AppResponses.js";

export const inventoryController = {
  create: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.create(req.body);
    return appResponses.success(res, inventory, "Inventory created successfully / تم إنشاء المخزون بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const inventories = await inventoryService.findAll();
    return appResponses.success(res, inventories, "Inventories fetched successfully / تم جلب المخزونات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.findById(req.params.id);
    return appResponses.success(res, inventory, "Inventory fetched successfully / تم جلب المخزون بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.update(req.params.id, req.body);
    return appResponses.success(res, inventory, "Inventory updated successfully / تم تحديث المخزون بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.delete(req.params.id);
    return appResponses.success(res, inventory, "Inventory deleted successfully / تم حذف المخزون بنجاح");
  })
};
