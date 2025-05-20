const jwt = require("jsonwebtoken");

// Public paths that should bypass auth
const publicPaths = ["/api/masteruser/login", "/api/masteruser/signup"];

const auth = (roles = []) => {
  return (req, res, next) => {
    // DEV LOG
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔐 [AUTH] Request: ${req.method} ${req.originalUrl}`);
    }

    // ✅ Check if the request should bypass auth
    const skipAuth = publicPaths.some((path) =>
      req.originalUrl.startsWith(path)
    );
    if (skipAuth) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`🔓 [AUTH] Bypassed for public route: ${req.originalUrl}`);
      }
      return next();
    }

    let token;
    const authHeader = req.headers.authorization;

    if (authHeader) {
      token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("⛔ [AUTH] No token provided");
      }
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("❌ [AUTH] Token verification failed:", error.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};

module.exports = auth;
