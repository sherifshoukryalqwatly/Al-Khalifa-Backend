import asyncWrapper from "../../utils/asyncHandler.js";
import { paymentService } from "../../services/Sales/payment.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";
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

export const paymentController = {
  /* -------------------------------
     CREATE PAYMENT
  -------------------------------- */
  createPayment: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const paymentData = { ...req.body, user: userId };
    const payment = await paymentService.createPayment(paymentData);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Payment',
      targetId: payment._id,
      description: `Created payment of amount: ${payment.amount}`
    });

    return appResponses.success(res, payment, "Payment created successfully / تم إنشاء الدفع بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET PAYMENT BY ID
  -------------------------------- */
  getPaymentById: asyncWrapper(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Payment',
      targetId: payment._id,
      description: `Fetched payment by ID`
    });

    return appResponses.success(res, payment, "Payment fetched successfully / تم جلب الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET PAYMENTS OF LOGGED-IN USER
  -------------------------------- */
  getMyPayments: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const payments = await paymentService.getPaymentsByUser(userId);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Payment',
      description: `Fetched all payments of logged-in user`
    });

    return appResponses.success(res, payments, "Your payments fetched successfully / تم جلب المدفوعات الخاصة بك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE PAYMENT
  -------------------------------- */
  updatePayment: asyncWrapper(async (req, res) => {
    const updated = await paymentService.updatePayment(req.params.id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Payment',
      targetId: updated._id,
      description: `Updated payment of amount: ${updated.amount}`
    });

    return appResponses.success(res, updated, "Payment updated successfully / تم تحديث الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE PAYMENT
  -------------------------------- */
  deletePayment: asyncWrapper(async (req, res) => {
    const deleted = await paymentService.deletePayment(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Payment',
      targetId: deleted._id,
      description: `Deleted payment of amount: ${deleted.amount}`
    });

    return appResponses.success(res, deleted, "Payment deleted successfully / تم حذف الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL PAYMENTS
  -------------------------------- */
  listPayments: asyncWrapper(async (req, res) => {
    const payments = await paymentService.listPayments();

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Payment',
      description: `Fetched all payments (count: ${payments.length})`
    });

    return appResponses.success(res, payments, "Payments fetched successfully / تم جلب جميع المدفوعات بنجاح", StatusCodes.OK);
  })
};
