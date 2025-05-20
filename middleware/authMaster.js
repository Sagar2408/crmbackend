// In middleware/authMaster.js
const jwt = require("jsonwebtoken");

const authMaster = () => {
  return function (req, res, next) {
    let token =
      req.headers.authorization?.split(" ")[1] || req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.MASTER_JWT_SECRET);
      req.masterUser = decoded;
      next();
    } catch (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = authMaster;
