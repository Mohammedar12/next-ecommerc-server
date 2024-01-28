const isAuthenticated = require("../middleware/auth");
const router = require("express").Router();
const checkout = require("../controller/order");



router.get("/orders", isAuthenticated, checkout.getOrders);
router.post("/checkout", isAuthenticated, checkout.checkoutSession);
// router.post("/webhook", express.raw({type: 'application/json'}),  checkout.webhook);

module.exports = router;
