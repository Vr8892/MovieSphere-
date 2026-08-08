const jwt = require("jsonwebtoken");

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  try {
    // Get token from headers
    const [scheme, token] = (req.headers.authorization || "").split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "No token provided. Please authenticate first."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    next();

  } catch (error) {
    console.log("Token Verification Error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please login again."
      });
    }
    
    return res.status(403).json({
      message: "Invalid or malformed token"
    });
  }
};

// Optional: Admin verification middleware
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required."
      });
    }
    next();

  } catch (error) {
    return res.status(403).json({
      message: "Authorization failed"
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin
};
