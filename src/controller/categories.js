const AppError = require("../helpers/AppError");
const Categories = require("../models/categories");
const { tryCatch } = require("../utils/tryCatch");
const Joi = require("joi");

module.exports = {
  index: tryCatch(async (req, res) => {
    const categories = await Categories.find();

    if (!categories) {
      return res.status(404).json({ message: "Categories not found" });
    }

    res.json(categories);
  }),
  byId: tryCatch(async (req, res) => {
    const categories = await Categories.findById(req.params.id);

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is missing." });
    }

    res.json(categories);
  }),
  create: tryCatch(async (req, res) => {
    req.body.user = req.user;
    const { name } = req.body;
    const newCategory = new Categories({
      name,
    });

    console.log(req.session, "Categories");
    const categories = await newCategory.save();
    res.status(201).json(categories); // Use 201 status code for resource creation
  }),
  update: tryCatch(async (req, res) => {
    const updateCategory = await Categories.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
        },
      }
    );
    res.status(201).json(updateCategory); // Use 201 status code for resource creation
  }),
  delete: tryCatch(async (req, res) => {
    const deleteCategory = await Categories.findByIdAndRemove({
      _id: req.params.id,
    });
    res.status(201).json(deleteCategory); // Use 201 status code for resource creation
  }),
};
