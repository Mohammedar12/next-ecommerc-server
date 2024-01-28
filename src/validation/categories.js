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

const postCategory = Joi.object({
  name: Joi.string().required(),
});

module.exports = { gerAddress, postCategory, updateAddress };
