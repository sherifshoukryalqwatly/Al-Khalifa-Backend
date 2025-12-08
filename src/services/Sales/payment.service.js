// ==========================================
// 🔹 PAYMENT SERVICE — BUSINESS LOGIC
// ==========================================
import { paymentRepo } from "../../repo/Sales/payment.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const paymentService = {

  /* -------------------------------
     CREATE PAYMENT
  -------------------------------- */
  async createPayment(data) {
    return paymentRepo.create(data);
  },

  /* -------------------------------
     GET PAYMENT BY ID
  -------------------------------- */
  async getPaymentById(id) {
    const payment = await paymentRepo.findById(id);
    if (!payment) throw AppErrors.notFound("Payment not found / الدفع غير موجود");
    return payment;
  },

  /* -------------------------------
     GET PAYMENTS OF LOGGED-IN USER
  -------------------------------- */
  async getPaymentsByUser(userId) {
    return paymentRepo.findByUser(userId);
  },

  /* -------------------------------
     UPDATE PAYMENT
  -------------------------------- */
  async updatePayment(id, update) {
    const updated = await paymentRepo.updateById(id, update);
    if (!updated) throw AppErrors.notFound("Payment not found / الدفع غير موجود");
    return updated;
  },

  /* -------------------------------
     DELETE PAYMENT
  -------------------------------- */
  async deletePayment(id) {
    const deleted = await paymentRepo.removeById(id);
    if (!deleted) throw AppErrors.notFound("Payment not found / الدفع غير موجود");
    return deleted;
  },

  /* -------------------------------
     LIST ALL PAYMENTS
  -------------------------------- */
  async listPayments(filter = {}) {
    return paymentRepo.findAll(filter);
  }
};
