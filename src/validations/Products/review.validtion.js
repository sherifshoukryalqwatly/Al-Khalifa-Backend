import Joi from "joi";
import mongoose from "mongoose";

// Validate Mongo ObjectId
const objectIdValidator = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId / معرف غير صالح");
  }
  return value;
});

// Validation schema for creating a review
export const createReviewSchema = Joi.object({
  product: objectIdValidator.required().messages({
    "any.required": "Product Id is Required / الرقم المميز للمنتج مطلوب"
  }),
  rating: Joi.number().min(1).max(5).required().messages({
    "any.required": "Rating is Required / التقييم مطلوب",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must not exceed 5"
  }),
  comment: Joi.string().optional(),
  isVerifiedPurchase: Joi.boolean().optional()
});

// Validation schema for updating a review
export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().optional(),
  isVerifiedPurchase: Joi.boolean().optional()
});
