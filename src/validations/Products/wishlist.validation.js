import Joi from "joi";
import mongoose from "mongoose";

// Validate Mongo ObjectId
const objectIdValidator = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId / معرف غير صالح");
  }
  return value;
});

// Add products schema
export const addProductsSchema = Joi.object({
  products: Joi.array().items(objectIdValidator).min(1).required().messages({
    "any.required": "Products array is required / قائمة المنتجات مطلوبة",
    "array.min": "At least one product must be provided / يجب تقديم منتج واحد على الأقل"
  })
});

// Remove products schema
export const removeProductsSchema = addProductsSchema; // same structure
