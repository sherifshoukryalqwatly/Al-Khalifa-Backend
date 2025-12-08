// ==========================================
// 🔹 REFUND CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { refundService } from "../../services/Sales/refund.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const refundController = {

  /* -------------------------------
     CREATE REFUND
  -------------------------------- */
  createRefund: asyncWrapper(async (req, res) => {
    const userId = req.user._id; // logged-in user
    const refundData = { ...req.body, user: userId };
    const refund = await refundService.createRefund(refundData);
    return appResponses.success(res, refund, "Refund created successfully / تم إنشاء طلب الاسترجاع بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET REFUND BY ID
  -------------------------------- */
  getRefundById: asyncWrapper(async (req, res) => {
    const refund = await refundService.getRefundById(req.params.id);
    return appResponses.success(res, refund, "Refund fetched successfully / تم جلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET REFUNDS OF LOGGED-IN USER
  -------------------------------- */
  getMyRefunds: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const refunds = await refundService.getRefundsByUser(userId);
    return appResponses.success(res, refunds, "Your refunds fetched successfully / تم جلب طلبات الاسترجاع الخاصة بك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE REFUND
  -------------------------------- */
  updateRefund: asyncWrapper(async (req, res) => {
    const updated = await refundService.updateRefund(req.params.id, req.body);
    return appResponses.success(res, updated, "Refund updated successfully / تم تحديث طلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE REFUND
  -------------------------------- */
  deleteRefund: asyncWrapper(async (req, res) => {
    const deleted = await refundService.deleteRefund(req.params.id);
    return appResponses.success(res, deleted, "Refund deleted successfully / تم حذف طلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL REFUNDS
  -------------------------------- */
  listRefunds: asyncWrapper(async (req, res) => {
    const refunds = await refundService.listRefunds();
    return appResponses.success(res, refunds, "Refunds fetched successfully / تم جلب جميع طلبات الاسترجاع بنجاح", StatusCodes.OK);
  })
};
