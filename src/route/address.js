const router = require("express").Router();
const isAuthenticated = require("../middleware/auth");
const Address = require("../controller/address");
const validator = require("../middleware/validator");
const address = require("../validation/address");

router.route("/address").get(isAuthenticated ,validator(address.gerAddress), Address.index);
router.route("/address/update/:id").put( validator(address.updateAddress), Address.update);
router.route("/address/new").post(isAuthenticated ,validator(address.postAddress), Address.create);

// router.get("/address/:id", Address.byId);
router.delete("/address/delete/:id", Address.delete);

module.exports = router;
