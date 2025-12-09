/* --------------------------------------------------------------------------
 * 🧾 Inventory Validation (Joi)
 * - Validates incoming request bodies
 * - Ensures product, variant, and quantity are provided
 * -------------------------------------------------------------------------- */
import Joi from "joi";

export const inventoryValidation = {
  create: Joi.object({
    product: Joi.string().required(),
    variant: Joi.object({
      size: Joi.string().required(),
      color: Joi.string().required()
    }).required(),
    quantity: Joi.number().min(0).required()
  }),

  update: Joi.object({
    variant: Joi.object({
      size: Joi.string().optional(),
      color: Joi.string().optional()
    }).optional(),
    quantity: Joi.number().min(0).optional()
  })
};
