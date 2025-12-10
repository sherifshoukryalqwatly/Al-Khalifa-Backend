import asyncWrapper from "../../utils/asyncHandler.js";
import { inventoryService } from "../../services/Sales/inventory.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper to log audit actions
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

export const inventoryController = {
  create: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.create(req.body);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Inventory',
      targetId: inventory._id,
      description: `Created inventory with quantity: ${inventory.quantity}`
    });

    return appResponses.success(res, inventory, "Inventory created successfully / تم إنشاء المخزون بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const inventories = await inventoryService.findAll();

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Inventory',
      description: `Fetched all inventories (count: ${inventories.length})`
    });

    return appResponses.success(res, inventories, "Inventories fetched successfully / تم جلب المخزونات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.findById(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Inventory',
      targetId: inventory._id,
      description: `Fetched inventory by ID`
    });

    return appResponses.success(res, inventory, "Inventory fetched successfully / تم جلب المخزون بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.update(req.params.id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Inventory',
      targetId: inventory._id,
      description: `Updated inventory with quantity: ${inventory.quantity}`
    });

    return appResponses.success(res, inventory, "Inventory updated successfully / تم تحديث المخزون بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const inventory = await inventoryService.delete(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Inventory',
      targetId: inventory._id,
      description: `Deleted inventory with quantity: ${inventory.quantity}`
    });

    return appResponses.success(res, inventory, "Inventory deleted successfully / تم حذف المخزون بنجاح");
  })
};
