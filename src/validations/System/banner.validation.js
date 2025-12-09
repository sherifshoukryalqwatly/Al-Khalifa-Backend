import Joi from "joi";

// Each localized string must have en and ar
const localizedString = Joi.object({
  en: Joi.string().trim().min(2).max(500).required(),
  ar: Joi.string().trim().min(2).max(500).required()
}).required();

export const bannerValidation = {
  create: Joi.object({
    title: localizedString,       // expect parsed JSON
    subtitle: localizedString.optional(),
    link: Joi.string().allow(null, ""),
    displayOrder: Joi.number().min(0).default(0),
    isActive: Joi.boolean().default(true)
  }),
  update: Joi.object({
    title: localizedString.optional(),
    subtitle: localizedString.optional(),
    link: Joi.string().allow(null, ""),
    displayOrder: Joi.number().min(0),
    isActive: Joi.boolean()
  })
};
