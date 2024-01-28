const router = require("express").Router();
const isAuthenticated = require("../middleware/auth");
const Categories = require("../controller/categories");
const validator = require("../middleware/validator");
const categories = require("../validation/categories");
const authRoles = require("../middleware/roles");

router.route("/categories").get(Categories.index);
router.route("/categories/:id").get(Categories.byId);
router.route("/categories/:id").put(Categories.update);
router
  .route("/categories/new")
  .post(
    isAuthenticated,
    authRoles("admin"),
    validator(categories.postCategory),
    Categories.create
  );

// router.get("/address/:id", Address.byId);
router.delete("/address/delete/:id", authRoles("admin"), Categories.delete);

module.exports = router;
