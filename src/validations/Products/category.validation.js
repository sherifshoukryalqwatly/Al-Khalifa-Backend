import Joi from "joi";

/* -------------------------------------------------------
   Localized String Validation (ar / en)
---------------------------------------------------------*/
const localizedStringSchema = Joi.object({
  ar: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "any.required": "النص العربي مطلوب",
      "string.empty": "النص العربي مطلوب",
      "string.min": "النص العربي يجب أن لا يقل عن 2 أحرف",
      "string.max": "النص العربي يجب أن لا يزيد عن 100 أحرف",
    }),

  en: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "any.required": "English text is required",
      "string.empty": "English text is required",
      "string.min": "Text must be at least 2 characters long",
      "string.max": "Text must not exceed 100 characters",
    }),
});

/* -------------------------------------------------------
   CREATE CATEGORY
---------------------------------------------------------*/
export const createCategorySchema = Joi.object({
  name: localizedStringSchema.required(),

  parent: Joi.string()
    .optional()
    .allow(null)
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid parent category ID",
    }),

  icon: Joi.string().optional(),
});

/* -------------------------------------------------------
   UPDATE CATEGORY
---------------------------------------------------------*/
export const updateCategorySchema = Joi.object({
  name: localizedStringSchema.optional(),

  parent: Joi.string()
    .optional()
    .allow(null)
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Invalid parent category ID",
    }),

  icon: Joi.string().optional(),

  isActive: Joi.boolean().optional(),
});
