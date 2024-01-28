const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Please Enter Your Street"],
  },
  city: {
    type: String,
    required: [true, "Please Enter Your City"],
  },
  state: {
    type: String,
    required: [true, "Please Enter Your State"],
  },
  ZIPcode: {
    type: Number,
    required: [true, "Please Enter Your ZIP Code"],
  },
  phone_number: {
    type: Number,
    required: [true, "Please Enter Your Phone Number"],
  },
  country: {
    type: String,
    required: [true, "Please Enter Your Country"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref : "User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("address", AddressSchema);
