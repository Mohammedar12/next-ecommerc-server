const Product = require("../models/product");
const { tryCatch } = require("../utils/tryCatch");
const { upload } = require("../utils/cloudinary");
const fs = require("fs");
const { log } = require("console");

module.exports = {
  index: tryCatch(async (req, res) => {
    const { name } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(filter);

    if (!name || name.trim() === "") {
      // If not provided or empty, return all products
      const allProducts = await Product.find();
      return res.json(allProducts);
    }
    res.json(products);
  }),
  category: tryCatch(async (req, res) => {
    const { page = 1, pageSize = 10, size, neckType, gender } = req.query;
    const catId = req.params.catId;

    let query = {
      category: catId,
    };

    if (req.query.size) {
      query.size = { $in: req.query.size.split(",") };
    }
    if (req.query.neckType) {
      query.neckType = { $in: req.query.neckType.split(",") };
    }
    if (req.query.gender) {
      query.gender = { $in: req.query.gender.split(",") };
    }

    const skip = (page - 1) * pageSize;

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(pageSize))
      .exec();

    if (!catId) {
      // If not provided or empty, return all products
      return res.status(404).json("not found");
    }
    res.json(products);
  }),
  count: tryCatch(async (req, res) => {
    const categoryId = req.params.catId;

    const count = await Product.countDocuments({ category: categoryId });
    // MongoDB method to count documents
    console.log(count); // MongoDB method to count documents
    res.json({ count });
  }),
  byId: tryCatch(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  }),
  create: tryCatch(async (req, res) => {
    const {
      name,
      description,
      price,
      category,
      seller,
      stock,
      size,
      gender,
      neckType,
    } = req.body;
    const files = req.files;

    const uploader = async (path) => {
      const response = await upload(path, "nextProject/products");

      return response; // Return the URL after upload
    };

    const urls = [];

    for (const file of files) {
      const { path } = file;
      const imgUrl = await uploader(path);
      urls.push(imgUrl);
      fs.unlinkSync(path);
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      size,
      gender,
      neckType,
      seller,
      stock,
      images: urls, // Use the array of URLs
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  }),
  delete: tryCatch(async (req, res) => {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(deletedProduct);
  }),
  // productImages: tryCatch(async (req, res) => {
  //   const product = await Product.findById(req.params.id);

  //   if (!product) {
  //     return res.status(404).json({ message: "Product not found" });
  //   }

  //   const uploader = async (path) => {
  //     console.log("Before Upload");
  //     const response = await upload(path, "nextProject/products");
  //     console.log("After Upload", response); // Add this line
  //   };
  //   const urls = [];
  //   const file = req.files;

  //   for (const file of files) {
  //     const { path } = file;
  //     const imgUrl = await uploader(path);
  //     urls.push(imgUrl);
  //     fs.unlinkSync(path);
  //   }

  //   product = await Product.findByIdAndUpdate(req.query.id, {
  //     images: urls,
  //   });

  //   res.json({
  //     data: urls,
  //     product,
  //   });
  // }),
};
