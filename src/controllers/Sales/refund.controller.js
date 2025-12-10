import asyncWrapper from "../../utils/asyncHandler.js";
import { refundService } from "../../services/Sales/refund.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper for audit logging
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?._id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
};

export const refundController = {
  /* -------------------------------
     CREATE REFUND
  -------------------------------- */
  createRefund: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const refundData = { ...req.body, user: userId };
    const refund = await refundService.createRefund(refundData);

    await logAction({
      req,
      action: "CREATE",
      targetModel: "Refund",
      targetId: refund._id,
      description: `Created refund request for order: ${refund.order}`
    });

    return appResponses.success(res, refund, "Refund created successfully / تم إنشاء طلب الاسترجاع بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET REFUND BY ID
  -------------------------------- */
  getRefundById: asyncWrapper(async (req, res) => {
    const refund = await refundService.getRefundById(req.params.id);

    await logAction({
      req,
      action: "READ",
      targetModel: "Refund",
      targetId: refund._id,
      description: `Fetched refund request by ID`
    });

    return appResponses.success(res, refund, "Refund fetched successfully / تم جلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET REFUNDS OF LOGGED-IN USER
  -------------------------------- */
  getMyRefunds: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const refunds = await refundService.getRefundsByUser(userId);

    await logAction({
      req,
      action: "READ",
      targetModel: "Refund",
      description: `Fetched all refunds of logged-in user`
    });

    return appResponses.success(res, refunds, "Your refunds fetched successfully / تم جلب طلبات الاسترجاع الخاصة بك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE REFUND
  -------------------------------- */
  updateRefund: asyncWrapper(async (req, res) => {
    const updated = await refundService.updateRefund(req.params.id, req.body);

    await logAction({
      req,
      action: "UPDATE",
      targetModel: "Refund",
      targetId: updated._id,
      description: `Updated refund request for order: ${updated.order}`
    });

    return appResponses.success(res, updated, "Refund updated successfully / تم تحديث طلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE REFUND
  -------------------------------- */
  deleteRefund: asyncWrapper(async (req, res) => {
    const deleted = await refundService.deleteRefund(req.params.id);

    await logAction({
      req,
      action: "DELETE",
      targetModel: "Refund",
      targetId: deleted._id,
      description: `Deleted refund request for order: ${deleted.order}`
    });

    return appResponses.success(res, deleted, "Refund deleted successfully / تم حذف طلب الاسترجاع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL REFUNDS
  -------------------------------- */
  listRefunds: asyncWrapper(async (req, res) => {
    const refunds = await refundService.listRefunds();

    await logAction({
      req,
      action: "READ",
      targetModel: "Refund",
      description: `Fetched all refunds (count: ${refunds.length})`
    });

    return appResponses.success(res, refunds, "Refunds fetched successfully / تم جلب جميع طلبات الاسترجاع بنجاح", StatusCodes.OK);
  })
};
