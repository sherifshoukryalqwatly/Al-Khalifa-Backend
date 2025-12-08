// ==========================================
// 🔹 PAYMENT VALIDATION — JOI SCHEMAS
// ==========================================
import Joi from "joi";

export const createPaymentSchema = Joi.object({
  order: Joi.string().required(),
  paymentMethod: Joi.string().valid("COD", "online", "paypal", "stripe").required(),
  transactionId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  status: Joi.string().valid("pending", "completed", "failed", "refunded").optional(),
  currency: Joi.string().optional()
});

export const updatePaymentSchema = Joi.object({
  paymentMethod: Joi.string().valid("COD", "online", "paypal", "stripe").optional(),
  transactionId: Joi.string().optional(),
  amount: Joi.number().min(0).optional(),
  status: Joi.string().valid("pending", "completed", "failed", "refunded").optional(),
  currency: Joi.string().optional()
});
