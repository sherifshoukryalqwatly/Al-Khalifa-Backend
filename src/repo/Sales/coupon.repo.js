// ==========================================
// 🔹 COUPON REPO — DATABASE OPERATIONS ONLY
// ==========================================
import Coupon from "../../models/Sales/coupon.model.js";

export const couponRepo = {

  /* -------------------------------
     CREATE NEW COUPON
  -------------------------------- */
  create(data) {
    return Coupon.create(data);
  },

  /* -------------------------------
     FIND COUPON BY CODE
  -------------------------------- */
  findByCode(code) {
    return Coupon.findOne({ code: code, isDeleted: false, active: true });
  },

  /* -------------------------------
     FIND COUPON BY ID
  -------------------------------- */
  findById(id) {
    return Coupon.findById(id);
  },

  /* -------------------------------
     UPDATE COUPON BY ID
  -------------------------------- */
  updateById(id, update) {
    return Coupon.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  /* -------------------------------
     SOFT DELETE COUPON
  -------------------------------- */
  removeById(id) {
    return Coupon.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  },

  /* -------------------------------
     LIST ALL COUPONS
  -------------------------------- */
  findAll(filter = {}) {
    return Coupon.find({ ...filter, isDeleted: false });
  }
};
