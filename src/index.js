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

const corsOptions = {
  origin: [
    "https://mynextappstore.netlify.app",
    "http://localhost:3000",
    "https://next-ecommerc-mocha.vercel.app",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: "Content-Length, X-Content-Example",
  maxAge: 86400,
};

app.use(cors(corsOptions));
// Configure the cookie-session middleware
app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey1"],
    maxAge: 24 * 60 * 60 * 1000,
    // sameSite: "None", // Set to 'None' for cross-site requests
    secure: true, // Set to true in production
    httpOnly: true, // Set to false if JavaScript needs to access the cookie
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
