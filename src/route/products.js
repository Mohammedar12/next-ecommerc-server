const router = require("express").Router();
const validator = require("../middleware/validator");
const validateProducts = require("../validation/products");
const Product = require("../controller/product");
const isAuthenticated = require("../middleware/auth");
const authRoles = require("../middleware/roles");
const upload = require("../utils/multer");

const uploadMiddleware = upload.array("image");

router.route("/products").get(isAuthenticated, Product.index);
router.route("/products/:catId").get(isAuthenticated, Product.category);
router.route("/productsCount/:catId").get(isAuthenticated, Product.count);
router
  .route("/product/new")
  .post(isAuthenticated, authRoles("admin"), uploadMiddleware, Product.create);
router.get("/product/:id", Product.byId);

router.delete(
  "/products/:id",
  isAuthenticated,
  authRoles("admin"),
  Product.delete
);

module.exports = router;
