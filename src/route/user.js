const isAuthenticated = require("../middleware/auth");
const router = require("express").Router();
const User = require("../controller/userAuth");
const upload = require("../utils/multer");

const uploadMiddleware = upload.array("image");

router.post("/login", isAuthenticated, User.login);

router.post("/sing-up", User.create);
router.put("/profile/update", isAuthenticated, uploadMiddleware, User.update);
router.get("/user", isAuthenticated, User.user);
router.post("/logout", isAuthenticated, User.logout);

module.exports = router;
