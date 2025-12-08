import Joi from "joi";

export const addItemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  variant: Joi.object({
    size: Joi.string().required(),
    color: Joi.string().required(),
  }).required(),
});
