require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const app = express();
const dbConnect = require("./config/DBconnect");

const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const session = require("./models/session");
const crypto = require("crypto");

const products = require("./route/products");
const user = require("./route/user");
const address = require("./route/address");
const order = require("./route/order");
const categories = require("./route/categories");
const webhook = require("./route/webhook");

const errorHandler = require("./middleware/middleware");

app.use("/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());

const corsOptions = {
  origin: ["https://next-ecmrc.com", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  expressSession({
    name: "session",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      mongooseConnection: mongoose.connection,
    }),
    genid: function (req) {
      return crypto
        .createhash("sha256")
        .update(uuid.v1())
        .update(crypto.randombytes(256))
        .digest("hex");
    },
    cookie: {
      maxAge: 60 * 60 * 1000,
      // domain:
      //   process.env.NODE_ENV === "production" ? "next-ecmrc.com" : "localhost",
      sameSite: "Lax", // Set SameSite attribute to Lax
    },
  })
);

app.use("/order", order);
app.use("/", user);
app.use("/", products);
app.use("/", address);
app.use("/", categories);

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("hi");
  dbConnect();
});
