/* --------------------------------------------------------------------------
 * 🧾 Notification Validation (Joi)
 * - Validates incoming request bodies
 * - Ensures Arabic & English text and proper type
 * -------------------------------------------------------------------------- */

import Joi from "joi";

const localizedString = Joi.object({
  en: Joi.string().trim().min(2).max(100).required(),
  ar: Joi.string().trim().min(2).max(100).required()
});

export const notificationValidation = {
  create: Joi.object({
    type: Joi.string().valid('INFO', 'PROMOTION', 'ORDER', 'REFUND', 'SYSTEM').required(),
    title: localizedString.required(),
    message: Joi.object({ en: Joi.string().trim().min(2).max(300).required(), ar: Joi.string().trim().min(2).max(300).required() }).required(),
    link: Joi.string().allow(null, "")
  }),

  update: Joi.object({
    type: Joi.string().valid('INFO', 'PROMOTION', 'ORDER', 'REFUND', 'SYSTEM').optional(),
    title: localizedString.optional(),
    message: Joi.object({ en: Joi.string().trim().min(2).max(300), ar: Joi.string().trim().min(2).max(300) }).optional(),
    link: Joi.string().allow(null, ""),
    isRead: Joi.boolean().optional()
  })
};
