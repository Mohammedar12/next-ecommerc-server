const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toDateString() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb({ error: "Unsupported file format . Upload jpg or jpeg or png" }, false);
  }
};

const upload = multer({
  storage,
  limits: { fielSize: 1024 * 1024 },
  fileFilter,
});

module.exports = upload;
