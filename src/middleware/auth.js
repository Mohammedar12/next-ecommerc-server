const config = require("../config/config");

const crypto = require("crypto");

const isAuthenticated = (req, res, next) => {
  const sess = req.session;

  const providedToken = req.headers.token;
  const expectedToken = config.frontEndToken;

  const tokensMatch = crypto.timingSafeEqual(
    Buffer.from(providedToken),
    Buffer.from(expectedToken)
  );

  if (tokensMatch) {
    if (sess.user) {
      req.user = sess.user;
    }

    next();
  } else {
    console.log("Request Headers Not there:", req.headers);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
