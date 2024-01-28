const isAuthenticated = require("../middleware/auth");
const router = require("express").Router();
const checkout = require("../controller/order");



router.post("/webhook",  checkout.webhook);

module.exports = router;
