const { z } = require("zod");

// User Registration Schema
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// User Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Refresh Token Schema
const refreshSchema = z.object({
  refreshToken: z.string().min(10, "Refresh token is required and must be valid"),
});

// Middleware to validate requests
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.errors });
  }
};

module.exports = { registerSchema, loginSchema, refreshSchema, validate };
