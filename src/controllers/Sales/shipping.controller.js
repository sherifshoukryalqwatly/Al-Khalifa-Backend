import asyncWrapper from "../../utils/asyncHandler.js";
import { shippingService } from "../../services/Sales/shipping.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper for audit logging
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
};

export const shippingController = {
  create: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.create(req.body);

    await logAction({
      req,
      action: "CREATE",
      targetModel: "Shipping",
      targetId: shipping._id,
      description: `Created shipping for order: ${shipping.order}`
    });

    return appResponses.success(res, shipping, "Shipping created successfully / تم إنشاء الشحنة بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const shippings = await shippingService.findAll();

    await logAction({
      req,
      action: "READ",
      targetModel: "Shipping",
      description: `Fetched all shippings (count: ${shippings.length})`
    });

    return appResponses.success(res, shippings, "Shippings fetched successfully / تم جلب جميع الشحنات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.findById(req.params.id);

    await logAction({
      req,
      action: "READ",
      targetModel: "Shipping",
      targetId: shipping._id,
      description: `Fetched shipping by ID`
    });

    return appResponses.success(res, shipping, "Shipping fetched successfully / تم جلب الشحنة بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const updatedShipping = await shippingService.update(req.params.id, req.body);

    await logAction({
      req,
      action: "UPDATE",
      targetModel: "Shipping",
      targetId: updatedShipping._id,
      description: `Updated shipping for order: ${updatedShipping.order}`
    });

    return appResponses.success(res, updatedShipping, "Shipping updated successfully / تم تحديث الشحنة بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const deletedShipping = await shippingService.delete(req.params.id);

    await logAction({
      req,
      action: "DELETE",
      targetModel: "Shipping",
      targetId: deletedShipping._id,
      description: `Deleted shipping for order: ${deletedShipping.order}`
    });

    return appResponses.success(res, deletedShipping, "Shipping deleted successfully / تم حذف الشحنة بنجاح");
  })
};
