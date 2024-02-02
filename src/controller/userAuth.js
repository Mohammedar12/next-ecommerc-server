const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../utils/tryCatch");
const { upload } = require("../utils/cloudinary");
const fs = require("fs");
require("dotenv").config();

module.exports = {
  create: tryCatch(async (req, res) => {
    const { name, email, password } = req.body;

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({ message: "User Already Exists ! " });
    }

    const hashPass = bcrypt.hashSync(password, 10);

    const addUser = User({
      name: name,
      email: email,
      password: hashPass,
    });

    const user = await addUser.save();
    res.json(user);
  }),
  login: tryCatch(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "email is not correct !" });

    const checkPassword = await bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.json({ message: "email or Password is not correct" });
    }

    const token = await jwt.sign({ id: user._id }, process.env.SECRET);

    req.session.user = user;

    console.log(req.session, "i'm user ");

    return res.json({
      name: user.name,
      email: user.email,
      token,
      userId: user._id,
      avatar: user.avatar.url,
      createdAt: user.createdAt,
    });
  }),
  logout: tryCatch(async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.clearCookie("session");
        res.json("done");
      }
    });
  }),
  update: tryCatch(async (req, res) => {
    const { id, avatar } = req.body;
    const newData = {
      name: req.body.name,
      avatar: avatar,
    };

    console.log(req.files);

    const uploader = async (path) => {
      console.log("Before Upload");
      const response = await upload(path, "nextProject/avatar");
      console.log("After Upload", response); // Add this line
      newData.avatar = response;
    };
    const file = req.files[0];
    const { path } = file;

    await uploader(path);
    fs.unlinkSync(path);

    const user = await User.findOneAndUpdate(
      { _id: req.query.id },
      newData,
      { new: true } // Return the modified document
    );
    req.session.user = user;
    // console.log(req);

    return res.json(user);
  }),
  user: tryCatch(async (req, res) => {
    const user = await User.findById(req.user);

    // console.log(req);

    return res.json(user);
  }),
};
