import Joi from 'joi';

/* ----------------------------- Localized String Schema ----------------------------- */
const localizedString = (min = 2, max = 500, required = true) => {
  const base = {
    en: Joi.string().trim().min(min).max(max),
    ar: Joi.string().trim().min(min).max(max),
  };

  if (required) {
    base.en = base.en.required().messages({
      'string.empty': 'English text is required / النص الإنجليزي مطلوب',
      'string.min': `English text must be at least ${min} characters / النص الإنجليزي يجب أن لا يقل عن ${min} أحرف`,
      'string.max': `English text must not exceed ${max} characters / النص الإنجليزي يجب ألا يزيد عن ${max} أحرف`,
    });

    base.ar = base.ar.required().messages({
      'string.empty': 'Arabic text is required / النص العربي مطلوب',
      'string.min': `Arabic text must be at least ${min} characters / النص العربي يجب أن لا يقل عن ${min} أحرف`,
      'string.max': `Arabic text must not exceed ${max} characters / النص العربي يجب ألا يزيد عن ${max} أحرف`,
    });
  }

  return Joi.object(base);
};

/* ----------------------------- Variant Schema ----------------------------- */
const variantSchema = Joi.object({
  size: Joi.string().required().messages({
    'any.required': 'Size is required / المقاس مطلوب',
    'string.empty': 'Size cannot be empty / المقاس لا يمكن أن يكون فارغاً',
  }),
  color: Joi.string().required().messages({
    'any.required': 'Color is required / اللون مطلوب',
    'string.empty': 'Color cannot be empty / اللون لا يمكن أن يكون فارغاً',
  }),
  stock: Joi.number().min(0).messages({
    'number.min': 'Stock must be positive / الكمية يجب أن تكون موجبة',
  }),
  sku: Joi.string().optional(),
});

/* ----------------------------- CREATE PRODUCT SCHEMA ----------------------------- */
export const createProductSchema = Joi.object({
  title: localizedString(3, 200, true),
  description: localizedString(5, 500, true),
  category: Joi.string().required().messages({
    'any.required': 'Category is required / الفئة مطلوبة',
    'string.empty': 'Category cannot be empty / الفئة لا يمكن أن تكون فارغة',
  }),
  brand: Joi.string().required().messages({
    'any.required': 'Brand is required / الماركة مطلوبة',
    'string.empty': 'Brand cannot be empty / الماركة لا يمكن أن تكون فارغة',
  }),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required / السعر مطلوب',
    'number.min': 'Price must be positive / السعر يجب أن يكون موجباً',
  }),
  discount: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Discount must be positive / الخصم يجب أن يكون موجباً',
    'number.max': 'Discount cannot exceed 100% / الخصم لا يمكن أن يزيد عن 100%',
  }),
  images: Joi.any(),
  variants: Joi.array().items(variantSchema).optional(),
  material: Joi.string().optional(),
  gender: Joi.string().valid('male', 'female', 'unisex').required().messages({
    'any.only': 'Gender must be male, female, or unisex / النوع يجب أن يكون ذكر، أنثى أو للجنسين',
    'any.required': 'Gender is required / النوع مطلوب',
  }),
  sportType: Joi.array().items(Joi.string()).optional(),
  isFeatured: Joi.boolean().optional(),
});

/* ----------------------------- UPDATE PRODUCT SCHEMA ----------------------------- */
export const updateProductSchema = Joi.object({
  title: localizedString(3, 200, false).optional(),
  description: localizedString(5, 500, false).optional(),
  category: Joi.string().optional(),
  brand: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  material: Joi.string().optional(),
  gender: Joi.string().valid('male', 'female', 'unisex').optional(),
  sportType: Joi.array().items(Joi.string()).optional(),
  isFeatured: Joi.boolean().optional(),
});

/* ----------------------------- DELETE MANY PRODUCTS SCHEMA ----------------------------- */
export const deleteManySchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string().length(24).hex().required())
    .min(1)
    .required()
    .messages({
      'array.base': 'IDs must be an array / يجب أن تكون المعرفات مصفوفة',
      'array.min': 'At least one ID is required / يجب توفير معرف واحد على الأقل',
      'any.required': 'IDs are required / المعرفات مطلوبة',
    }),
});
