/* --------------------------------------------------------------------------
 * 🎮 Shipping Controller (HTTP Layer)
 * - Handles express req/res
 * - Delegates logic to service layer
 * - Sends formatted responses
 * -------------------------------------------------------------------------- */
import asyncWrapper from "../../utils/asyncHandler.js";
import { shippingService } from "../../services/Sales/shipping.service.js";
import { appResponses } from "../../utils/AppResponses.js";

export const shippingController = {
  create: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.create(req.body);
    return appResponses.success(res, shipping, "Shipping created successfully / تم إنشاء الشحنة بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const shippings = await shippingService.findAll();
    return appResponses.success(res, shippings, "Shippings fetched successfully / تم جلب جميع الشحنات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.findById(req.params.id);
    return appResponses.success(res, shipping, "Shipping fetched successfully / تم جلب الشحنة بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.update(req.params.id, req.body);
    return appResponses.success(res, shipping, "Shipping updated successfully / تم تحديث الشحنة بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const shipping = await shippingService.delete(req.params.id);
    return appResponses.success(res, shipping, "Shipping deleted successfully / تم حذف الشحنة بنجاح");
  })
};
