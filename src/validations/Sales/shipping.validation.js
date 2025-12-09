/* --------------------------------------------------------------------------
 * 🧾 Shipping Validation (Joi)
 * - Validates incoming request bodies
 * - Ensures carrier, tracking, status, and optional estimated delivery
 * -------------------------------------------------------------------------- */
import Joi from "joi";

export const shippingValidation = {
  create: Joi.object({
    order: Joi.string().required(),
    carrier: Joi.string().required(),
    trackingNumber: Joi.string().required(),
    status: Joi.string().valid("pending", "shipped", "in_transit", "delivered", "cancelled").default("pending"),
    estimatedDelivery: Joi.date().optional()
  }),

  update: Joi.object({
    carrier: Joi.string().optional(),
    trackingNumber: Joi.string().optional(),
    status: Joi.string().valid("pending", "shipped", "in_transit", "delivered", "cancelled").optional(),
    estimatedDelivery: Joi.date().optional()
  })
};
