// ==========================================
// 🔹 REFUND SERVICE — BUSINESS LOGIC
// ==========================================
import { refundRepo } from "../../repo/Sales/refund.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const refundService = {

  /* -------------------------------
     CREATE REFUND
  -------------------------------- */
  async createRefund(data) {
    return refundRepo.create(data);
  },

  /* -------------------------------
     GET REFUND BY ID
  -------------------------------- */
  async getRefundById(id) {
    const refund = await refundRepo.findById(id);
    if (!refund) throw AppErrors.notFound("Refund not found / الاسترجاع غير موجود");
    return refund;
  },

  /* -------------------------------
     GET REFUNDS OF LOGGED-IN USER
  -------------------------------- */
  async getRefundsByUser(userId) {
    return refundRepo.findByUser(userId);
  },

  /* -------------------------------
     UPDATE REFUND
  -------------------------------- */
  async updateRefund(id, update) {
    const updated = await refundRepo.updateById(id, update);
    if (!updated) throw AppErrors.notFound("Refund not found / الاسترجاع غير موجود");
    return updated;
  },

  /* -------------------------------
     DELETE REFUND
  -------------------------------- */
  async deleteRefund(id) {
    const deleted = await refundRepo.removeById(id);
    if (!deleted) throw AppErrors.notFound("Refund not found / الاسترجاع غير موجود");
    return deleted;
  },

  /* -------------------------------
     LIST ALL REFUNDS
  -------------------------------- */
  async listRefunds(filter = {}) {
    return refundRepo.findAll(filter);
  }
};
