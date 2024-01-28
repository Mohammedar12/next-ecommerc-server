require('dotenv').config();
const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose.connect(process.env.DB_URI);
};

module.exports = dbConnect;
