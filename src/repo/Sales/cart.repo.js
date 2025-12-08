// ==========================================
// 🔹 CART REPO — DATABASE OPERATIONS ONLY
// ==========================================
import Cart from "../../models/Sales/cart.model.js";

export const cartRepo = {
  /* -------------------------------
     CREATE NEW CART
  -------------------------------- */
  create(data) {
    return Cart.create(data);
  },

  /* -------------------------------
     FIND CART BY USER ID
  -------------------------------- */
  findByUser(userId) {
    return Cart.findOne({ user: userId, isDeleted: false });
  },

  /* -------------------------------
     UPDATE CART BY USER ID
  -------------------------------- */
  updateByUser(userId, update) {
    return Cart.findOneAndUpdate(
      { user: userId, isDeleted: false },
      update,
      { new: true, runValidators: true }
    );
  },

  /* -------------------------------
     SOFT DELETE CART
  -------------------------------- */
  removeCart(userId) {
    return Cart.findOneAndUpdate(
      { user: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }
};
