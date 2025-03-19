const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const logger = require("../utils/logger");

// Middleware to verify JWT token
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[Auth Middleware] Missing or invalid token");
    return next(new ApiError(401, "Unauthorized access, token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request object
    logger.info(`[Auth Middleware] User authenticated: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error(`[Auth Middleware] Invalid token: ${error.message}`);
    return next(new ApiError(403, "Invalid or expired token"));
  }
});

module.exports = authenticate;
