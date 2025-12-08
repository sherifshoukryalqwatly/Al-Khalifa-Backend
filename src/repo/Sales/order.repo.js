// ==========================================
// 🔹 ORDER REPO — DATABASE OPERATIONS ONLY
// ==========================================
import Order from "../../models/Sales/order.model.js";

export const orderRepo = {

  /* -------------------------------
     CREATE NEW ORDER
  -------------------------------- */
  create(data) {
    return Order.create(data);
  },

  /* -------------------------------
     FIND ORDER BY ID
  -------------------------------- */
  findById(id) {
    return Order.findById(id).populate("items.product").populate("coupon");
  },

  /* -------------------------------
     FIND ORDERS BY USER
  -------------------------------- */
  findByUser(userId) {
    return Order.find({ user: userId, isDeleted: false })
                .populate("items.product")
                .populate("coupon");
  },

  /* -------------------------------
     UPDATE ORDER BY ID
  -------------------------------- */
  updateById(id, update) {
    return Order.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  /* -------------------------------
     SOFT DELETE ORDER
  -------------------------------- */
  removeById(id) {
    return Order.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  },

  /* -------------------------------
     LIST ALL ORDERS
  -------------------------------- */
  findAll(filter = {}) {
    return Order.find({ ...filter, isDeleted: false })
                .populate("items.product")
                .populate("coupon");
  }
};
