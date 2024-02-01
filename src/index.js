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

const expressSession = require("express-session");
const FileStore = require("session-file-store")(expressSession);

app.use("/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());

const corsOptions = {
  origin: ["https://next-ecmrc.com", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  // exposedHeaders: "Content-Length, X-Content-Example",
  maxAge: 86400,
};

app.use(cors(corsOptions));
// Configure the cookie-session middleware
app.use((req, res, next) => {
  console.log("Before cookie-session:", req.session);
  next();
});

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["secretKey1"],
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
//     secure: false, // Set to true in production
//     domain: "localhost",
//   })
// );

app.use(
  expressSession({
    name: "session",
    secret: "secretKey1",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      // domain:
      //   process.env.NODE_ENV === "production" ? "next-ecmrc.com" : "localhost",
      sameSite: "Lax", // Set SameSite attribute to Lax
    },
  })
);

app.use((req, res, next) => {
  console.log("After cookie-session:", req.session);
  next();
});

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
