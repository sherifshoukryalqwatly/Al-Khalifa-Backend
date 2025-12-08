// ==========================================
// 🔹 PAYMENT REPO — DATABASE OPERATIONS ONLY
// ==========================================
import Payment from "../../models/Sales/payment.model.js";

export const paymentRepo = {

  /* -------------------------------
     CREATE PAYMENT
  -------------------------------- */
  create(data) {
    return Payment.create(data);
  },

  /* -------------------------------
     FIND PAYMENT BY ID
  -------------------------------- */
  findById(id) {
    return Payment.findById(id).populate("user").populate("order");
  },

  /* -------------------------------
     FIND PAYMENTS BY USER
  -------------------------------- */
  findByUser(userId) {
    return Payment.find({ user: userId, isDeleted: false })
                  .populate("order");
  },

  /* -------------------------------
     UPDATE PAYMENT BY ID
  -------------------------------- */
  updateById(id, update) {
    return Payment.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  /* -------------------------------
     SOFT DELETE PAYMENT
  -------------------------------- */
  removeById(id) {
    return Payment.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  },

  /* -------------------------------
     LIST ALL PAYMENTS
  -------------------------------- */
  findAll(filter = {}) {
    return Payment.find({ ...filter, isDeleted: false }).populate("user").populate("order");
  }
};
