const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Discription"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
  },
  images: [
    {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    index: true,
    required: [true, "Please Enter Product Category"],
  },
  gender: [
    {
      type: String,
      enum: {
        values: ["Men", "Women"],
        message: "Please select correct gender",
      },
      required: [true, "Please Enter Product Gender"],
    },
  ],
  neckType: {
    type: String,
    enum: {
      values: ["Polo", "Round", "V", "Crew"],
      message: "Please select correct Neck Type",
    },
    required: [true, "Please Enter Product Neck Type"],
  },
  size: {
    type: String,
    enum: {
      values: ["XS", "S", "M", "L", "XL", "XXL"],
      message: "Please select correct Neck Type",
    },
  },

  seller: {
    type: String,
    required: [true, "Please Enter Product Seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("product", ProductSchema);
