// ==========================================
// 🔹 PAYMENT CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { paymentService } from "../../services/Sales/payment.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const paymentController = {

  /* -------------------------------
     CREATE PAYMENT
  -------------------------------- */
  createPayment: asyncWrapper(async (req, res) => {
    const userId = req.user._id; // logged-in user
    const paymentData = { ...req.body, user: userId };
    const payment = await paymentService.createPayment(paymentData);
    return appResponses.success(res, payment, "Payment created successfully / تم إنشاء الدفع بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET PAYMENT BY ID
  -------------------------------- */
  getPaymentById: asyncWrapper(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);
    return appResponses.success(res, payment, "Payment fetched successfully / تم جلب الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET PAYMENTS OF LOGGED-IN USER
  -------------------------------- */
  getMyPayments: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const payments = await paymentService.getPaymentsByUser(userId);
    return appResponses.success(res, payments, "Your payments fetched successfully / تم جلب المدفوعات الخاصة بك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE PAYMENT
  -------------------------------- */
  updatePayment: asyncWrapper(async (req, res) => {
    const updated = await paymentService.updatePayment(req.params.id, req.body);
    return appResponses.success(res, updated, "Payment updated successfully / تم تحديث الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE PAYMENT
  -------------------------------- */
  deletePayment: asyncWrapper(async (req, res) => {
    const deleted = await paymentService.deletePayment(req.params.id);
    return appResponses.success(res, deleted, "Payment deleted successfully / تم حذف الدفع بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL PAYMENTS
  -------------------------------- */
  listPayments: asyncWrapper(async (req, res) => {
    const payments = await paymentService.listPayments();
    return appResponses.success(res, payments, "Payments fetched successfully / تم جلب جميع المدفوعات بنجاح", StatusCodes.OK);
  })
};
