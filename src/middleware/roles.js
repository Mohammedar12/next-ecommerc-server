const config = require("../config/config");
const crypto = require("crypto");

const authRoles =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.log("User role not found.");
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      console.log(
        `User with role ${req.user.role} is not authorized for this resource.`
      );
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };

module.exports = authRoles;
