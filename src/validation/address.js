const Joi = require("joi");

const gerAddress = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  ZIPcode: Joi.number(),
  phone_number: Joi.number(),
  country: Joi.string(),
});
const updateAddress = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  ZIPcode: Joi.number(),
  phone_number: Joi.number(),
  country: Joi.string(),
});

const postAddress = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  ZIPcode: Joi.number().required(),
  phone_number: Joi.number().required(),
  country: Joi.string().required(),
  user: Joi.string(),
});

module.exports = { gerAddress, postAddress, updateAddress };
