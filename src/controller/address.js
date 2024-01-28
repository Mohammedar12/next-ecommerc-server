const AppError = require("../helpers/AppError");
const Address = require("../models/address");
const { tryCatch } = require("../utils/tryCatch");
const Joi = require("joi");

module.exports = {
  index: tryCatch(async (req, res) => {
    const address = await Address.find({ user: req.user._id });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);
  }),
  byId: tryCatch(async (req, res) => {
    const address = await Address.findById(req.body._id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json(address);
  }),
  create: tryCatch(async (req, res) => {
    req.body.user = req.user;
    const { street, city, state, ZIPcode, phone_number, country, user } =
      req.body;
    const newAddress = new Address({
      street,
      city,
      state,
      ZIPcode,
      phone_number,
      country,
      user,
    });

    console.log(req.session , 'address');
    const address = await newAddress.save();
    res.status(201).json(address); // Use 201 status code for resource creation
  }),
  update: tryCatch(async (req, res) => {
    const updateAddress = await Address.updateOne(
      { _id: req.params.id },
      {
        $set: {
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          ZIPcode: req.body.ZIPcode,
          phone_number: req.body.phone_number,
          country: req.body.country,
        },
      }
    );
    res.status(201).json(updateAddress); // Use 201 status code for resource creation
  }),
  delete: tryCatch(async (req, res) => {
    const deleteAddress = await Address.findByIdAndRemove({
      _id: req.params.id,
    });
    res.status(201).json(deleteAddress); // Use 201 status code for resource creation
  }),
};
