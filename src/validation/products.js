const Joi = require("joi");

const gerProdducts = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  ZIPcode: Joi.number(),
  phone_number: Joi.number(),
  country: Joi.string(),
});

const createProduct = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  seller: Joi.string().required(),
  size: Joi.string().required(),
  gender: Joi.string().required(),
  neckType: Joi.string().required(),
  images: Joi.array().required(),
  stock: Joi.number().required(),
  ratings: Joi.number(),
  reviews: Joi.array(),
});

module.exports = { gerProdducts, createProduct };
