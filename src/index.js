const express = require("express");
// const session = require("express-session");
const cookieSession = require("cookie-session");

const cors = require("cors");
const app = express();
const dbConnect = require("./config/DBconnect");

require("dotenv").config();
const products = require("./route/products");
const user = require("./route/user");
const address = require("./route/address");
const order = require("./route/order");
const categories = require("./route/categories");
const webhook = require("./route/webhook");
const errorHandler = require("./middleware/middleware");

const MongoStore = require("connect-mongo");

app.use("/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://mynextappstore.netlify.app",
    credentials: true,
  })
);
// Configure the cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey1"], // Replace with your own secret keys
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  })
);

app.use("/order", order);
app.use("/", user);
app.use("/", products);
app.use("/", address);
app.use("/", categories);
// app.use("/order", order);

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("hi");
  dbConnect();
});
