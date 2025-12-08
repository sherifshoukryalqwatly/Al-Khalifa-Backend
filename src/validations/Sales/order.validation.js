// ==========================================
// 🔹 ORDER VALIDATION — JOI SCHEMAS
// ==========================================
import Joi from "joi";

export const orderItemSchema = Joi.object({
  product: Joi.string().required(),
  variant: Joi.object({
    size: Joi.string().required(),
    color: Joi.string().required()
  }).required(),
  quantity: Joi.number().min(1).required(),
  priceAtTime: Joi.number().min(0).required(),
  totalItemPrice: Joi.number().min(0).required()
});

export const addressSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  building: Joi.string().required(),
  notes: Joi.string().optional()
});

export const createOrderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  shippingAddress: addressSchema.required(),
  paymentMethod: Joi.string().valid("COD", "online").required(),
  coupon: Joi.string().optional(),
  couponDiscount: Joi.number().min(0).optional(),
  subtotalPrice: Joi.number().min(0).required(),
  shippingFee: Joi.number().min(0).required(),
  finalPrice: Joi.number().min(0).required()
});

export const updateOrderSchema = Joi.object({
  paymentStatus: Joi.string().valid("pending", "paid", "failed", "refunded").optional(),
  orderStatus: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").optional()
});
