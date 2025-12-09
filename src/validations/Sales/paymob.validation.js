import Joi from 'joi';


export const createPaymentSchema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().valid('EGP').default('EGP'),
    items: Joi.array().items(Joi.object()).optional(),
    user: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().allow(''),
    address: Joi.string().optional().allow(''),
    }).required(),
});