// ==========================================
// 🔹 COUPON CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { couponService } from "../../services/Sales/coupon.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const couponController = {

  /* -------------------------------
     CREATE COUPON
  -------------------------------- */
  createCoupon: asyncWrapper(async (req, res) => {
    const coupon = await couponService.createCoupon(req.body);
    return appResponses.success(res, coupon, "Coupon created successfully / تم إنشاء الكوبون بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET COUPON BY CODE
  -------------------------------- */
  getCouponByCode: asyncWrapper(async (req, res) => {
    const coupon = await couponService.getCouponByCode(req.params.code);
    return appResponses.success(res, coupon, "Coupon fetched successfully / تم جلب الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
   APPLY COUPON TO CART
-------------------------------- */
applyCoupon: asyncWrapper(async (req, res) => {
  const { cartTotal, couponCode } = req.body;

  // ✅ get userId from authenticated user
  const userId = req.user._id;

  const result = await couponService.applyCoupon(cartTotal, couponCode, userId);
  return appResponses.success(
    res,
    result,
    "Coupon applied successfully / تم تطبيق الكوبون بنجاح",
    StatusCodes.OK
  );
}),

  /* -------------------------------
     UPDATE COUPON
  -------------------------------- */
  updateCoupon: asyncWrapper(async (req, res) => {
    const updated = await couponService.updateCoupon(req.params.id, req.body);
    return appResponses.success(res, updated, "Coupon updated successfully / تم تحديث الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE COUPON
  -------------------------------- */
  deleteCoupon: asyncWrapper(async (req, res) => {
    const deleted = await couponService.deleteCoupon(req.params.id);
    return appResponses.success(res, deleted, "Coupon deleted successfully / تم حذف الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL COUPONS
  -------------------------------- */
  listCoupons: asyncWrapper(async (req, res) => {
    const coupons = await couponService.listCoupons();
    return appResponses.success(res, coupons, "Coupons fetched successfully / تم جلب جميع الكوبونات بنجاح", StatusCodes.OK);
  })
};
