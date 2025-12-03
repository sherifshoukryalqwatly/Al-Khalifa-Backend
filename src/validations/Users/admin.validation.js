import Joi from 'joi';

// Helper to create localized string validation
const localizedStringSchema = (min = 2, max = 500, required = true) => {
  const schema = Joi.object({
    ar: Joi.string()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'string.empty': 'النص العربي مطلوب',
        'string.min': `النص العربي يجب أن لا يقل عن ${min} أحرف`,
        'string.max': `النص العربي يجب أن لا يزيد عن ${max} أحرف`,
        'any.required': 'النص العربي مطلوب'
      }),
    en: Joi.string()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'string.empty': 'English text is required',
        'string.min': `Text must be at least ${min} characters long`,
        'string.max': `Text must not exceed ${max} characters`,
        'any.required': 'English text is required'
      })
  });

  return required ? schema.required() : schema.optional();
};

// Main admin validation schema for CREATE
export const createAdminSchema = Joi.object({
  name: localizedStringSchema(2, 100, true),
  bio: localizedStringSchema(10, 1000, true),
  role: Joi.string()
    .valid('super_admin', 'admin')
    .default('admin')
    .optional()
    .messages({
      'any.only': 'Role must be either super_admin or admin / يجب أن يكون الدور إما super_admin أو admin'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.empty': 'Admin Password is required / كلمة المرور مطلوبة',
      'string.min': 'Password must be at least 8 characters long / كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      'string.max': 'Password too long / كلمة المرور طويلة جداً',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character / كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص',
      'any.required': 'Admin Password is required / كلمة المرور مطلوبة'
    }),
  profileImage: Joi.string()
    .pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
    .required()
    .messages({
      'string.empty': 'Profile image is required / الصورة الشخصية مطلوبة',
      'string.pattern.base': 'Invalid image URL format / صيغة رابط الصورة غير صالحة',
      'any.required': 'Profile image is required / الصورة الشخصية مطلوبة'
    }),
    phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required / رقم الهاتف مطلوب',
      'string.pattern.base': 'Invalid phone number / رقم هاتف غير صالح',
      'any.required': 'Phone number is required / رقم الهاتف مطلوب'
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required / البريد الإلكتروني مطلوب',
      'string.email': 'Invalid email format / بريد إلكتروني غير صالح',
      'any.required': 'Email is required / البريد الإلكتروني مطلوب'
    }),
  isActive: Joi.boolean()
    .default(true)
    .optional()
});

// Main admin validation schema for UPDATE
export const updateAdminSchema = Joi.object({
  name: localizedStringSchema(2, 100, false),
  bio: localizedStringSchema(10, 1000, false),
  role: Joi.string()
    .valid('super_admin', 'admin')
    .optional()
    .messages({
      'any.only': 'Role must be either super_admin or admin / يجب أن يكون الدور إما super_admin أو admin'
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional()
    .messages({
      'string.min': 'Password must be at least 8 characters long / كلمة المرور يجب أن تكون 8 أحرف على الأقل',
      'string.max': 'Password too long / كلمة المرور طويلة جداً',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character / كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص'
    }),
  profileImage: Joi.string()
    .pattern(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid image URL format / صيغة رابط الصورة غير صالحة'
    }),
phone: Joi.string()
    .trim()
    .pattern(/^\+?[0-9]{7,15}$/)
    .optional()
    .messages({
    'string.pattern.base': 'Invalid phone number / رقم هاتف غير صالح'
    }),
email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .optional()
    .messages({
    'string.email': 'Invalid email format / بريد إلكتروني غير صالح'
    }).optional(),
})