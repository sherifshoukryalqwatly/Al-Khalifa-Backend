// ==========================================
// 🔹 REFUND VALIDATION — JOI SCHEMAS
// ==========================================
import Joi from "joi";

export const createRefundSchema = Joi.object({
  order: Joi.string().required(),
  payment: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  reason: Joi.string().required(),
  status: Joi.string().valid("pending", "approved", "rejected", "completed").optional(),
  notes: Joi.string().optional()
});

export const updateRefundSchema = Joi.object({
  amount: Joi.number().min(1).optional(),
  reason: Joi.string().optional(),
  status: Joi.string().valid("pending", "approved", "rejected", "completed").optional(),
  notes: Joi.string().optional()
});
