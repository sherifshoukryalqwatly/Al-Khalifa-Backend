// ==========================================
// 🔹 COUPON VALIDATION — JOI SCHEMAS
// ==========================================
import Joi from "joi";

export const createCouponSchema = Joi.object({
  code: Joi.string().required(),
  discountType: Joi.string().valid("percentage", "fixed").required(),
  discountValue: Joi.number().min(1).required(),
  maxDiscountAmount: Joi.number().optional(),
  minCartValue: Joi.number().optional(),
  expiresAt: Joi.date().required(),
  usageLimit: Joi.number().optional(),
  usageLimitPerUser: Joi.number().optional(),
  active: Joi.boolean().optional()
});

export const applyCouponSchema = Joi.object({
  cartTotal: Joi.number().min(0).required(),
  couponCode: Joi.string().required()
});

export const updateCouponSchema = Joi.object({
  code: Joi.string().optional(),
  discountType: Joi.string().valid("percentage", "fixed").optional(),
  discountValue: Joi.number().min(1).optional(),
  maxDiscountAmount: Joi.number().optional(),
  minCartValue: Joi.number().optional(),
  expiresAt: Joi.date().optional(),
  usageLimit: Joi.number().optional(),
  usageLimitPerUser: Joi.number().optional(),
  active: Joi.boolean().optional()
});
