// ==========================================
// 🔹 COUPON CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { couponService } from "../../services/Sales/coupon.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper for audit logs
const logAction = async ({ req, user, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: user?._id || user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null
  });
};

export const couponController = {

  /* -------------------------------
     CREATE COUPON
  -------------------------------- */
  createCoupon: asyncWrapper(async (req, res) => {
    const coupon = await couponService.createCoupon(req.body);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Coupon',
      targetId: coupon._id,
      description: `Created coupon with code: ${coupon.code}`
    });

    return appResponses.success(res, coupon, "Coupon created successfully / تم إنشاء الكوبون بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET COUPON BY CODE
  -------------------------------- */
  getCouponByCode: asyncWrapper(async (req, res) => {
    const coupon = await couponService.getCouponByCode(req.params.code);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Coupon',
      targetId: coupon._id,
      description: `Fetched coupon by code: ${coupon.code}`
    });

    return appResponses.success(res, coupon, "Coupon fetched successfully / تم جلب الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
   APPLY COUPON TO CART
  -------------------------------- */
  applyCoupon: asyncWrapper(async (req, res) => {
    const { cartTotal, couponCode } = req.body;
    const userId = req.user._id;
    const result = await couponService.applyCoupon(cartTotal, couponCode, userId);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Coupon',
      description: `Applied coupon ${couponCode} to cart for user ${userId}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Coupon',
      targetId: updated._id,
      description: `Updated coupon with code: ${updated.code}`
    });

    return appResponses.success(res, updated, "Coupon updated successfully / تم تحديث الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE COUPON
  -------------------------------- */
  deleteCoupon: asyncWrapper(async (req, res) => {
    const deleted = await couponService.deleteCoupon(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Coupon',
      targetId: deleted._id,
      description: `Deleted coupon with code: ${deleted.code}`
    });

    return appResponses.success(res, deleted, "Coupon deleted successfully / تم حذف الكوبون بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL COUPONS
  -------------------------------- */
  listCoupons: asyncWrapper(async (req, res) => {
    const coupons = await couponService.listCoupons();

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Coupon',
      description: `Fetched all coupons (count: ${coupons.length})`
    });

    return appResponses.success(res, coupons, "Coupons fetched successfully / تم جلب جميع الكوبونات بنجاح", StatusCodes.OK);
  })
};
