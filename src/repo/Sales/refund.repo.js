// ==========================================
// 🔹 REFUND REPO — DATABASE OPERATIONS ONLY
// ==========================================
import Refund from "../../models/Sales/refund.model.js";

export const refundRepo = {

  /* -------------------------------
     CREATE REFUND
  -------------------------------- */
  create(data) {
    return Refund.create(data);
  },

  /* -------------------------------
     FIND REFUND BY ID
  -------------------------------- */
  findById(id) {
    return Refund.findById(id).populate("user").populate("order").populate("payment");
  },

  /* -------------------------------
     FIND REFUNDS BY USER
  -------------------------------- */
  findByUser(userId) {
    return Refund.find({ user: userId, isDeleted: false })
                 .populate("order")
                 .populate("payment");
  },

  /* -------------------------------
     UPDATE REFUND BY ID
  -------------------------------- */
  updateById(id, update) {
    return Refund.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  /* -------------------------------
     SOFT DELETE REFUND
  -------------------------------- */
  removeById(id) {
    return Refund.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  },

  /* -------------------------------
     LIST ALL REFUNDS
  -------------------------------- */
  findAll(filter = {}) {
    return Refund.find({ ...filter, isDeleted: false }).populate("user").populate("order").populate("payment");
  }
};
