// ==========================================
// 🔹 COUPON SERVICE — BUSINESS LOGIC
// ==========================================
import { couponRepo } from "../../repo/Sales/coupon.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const couponService = {

  /* -------------------------------
     CREATE NEW COUPON
  -------------------------------- */
  async createCoupon(data) {
    const existing = await couponRepo.findByCode(data.code);
    if (existing) throw AppErrors.conflict("Coupon code already exists / كود الكوبون موجود بالفعل");

    return couponRepo.create(data);
  },

  /* -------------------------------
     GET COUPON BY CODE
  -------------------------------- */
  async getCouponByCode(code) {
    const coupon = await couponRepo.findByCode(code);
    if (!coupon) throw AppErrors.notFound("Coupon not found / الكوبون غير موجود");

    // Check expiration
    if (coupon.expiresAt < new Date() || !coupon.active)
      throw AppErrors.badRequest("Coupon expired or inactive / الكوبون منتهي الصلاحية أو غير فعال");

    return coupon;
  },

  /* -------------------------------
     APPLY COUPON TO CART
  -------------------------------- */
  async applyCoupon(cartTotal, couponCode, userId) {
    const coupon = await this.getCouponByCode(couponCode);

    // Check min cart value
    if (cartTotal < coupon.minCartValue)
      throw AppErrors.badRequest(`Minimum cart value not met / الحد الأدنى لقيمة السلة غير مستوفى: ${coupon.minCartValue}`);

    // Check per-user usage limit
    if (coupon.usageLimitPerUser && coupon.usedCount >= coupon.usageLimit)
      throw AppErrors.badRequest("Coupon usage limit reached / تم الوصول للحد الأقصى للكوبون");

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    return {
      coupon,
      discountAmount,
      totalAfterDiscount: cartTotal - discountAmount
    };
  },

  /* -------------------------------
     INCREMENT COUPON USED COUNT
  -------------------------------- */
  async incrementUsedCount(couponId) {
    return couponRepo.updateById(couponId, { $inc: { usedCount: 1 } });
  },

  /* -------------------------------
     UPDATE COUPON
  -------------------------------- */
  async updateCoupon(id, update) {
    return couponRepo.updateById(id, update);
  },

  /* -------------------------------
     DELETE COUPON
  -------------------------------- */
  async deleteCoupon(id) {
    return couponRepo.removeById(id);
  },

  /* -------------------------------
     LIST ALL COUPONS
  -------------------------------- */
  async listCoupons(filter = {}) {
    return couponRepo.findAll(filter);
  }
};
