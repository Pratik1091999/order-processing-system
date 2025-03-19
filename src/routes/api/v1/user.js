const express = require("express");
const router = express.Router();
const { registerUser, loginUser , refreshToken } = require("../../../controllers/api/v1/user");

const { registerSchema, loginSchema, refreshSchema, validate } = require("../../../utils/authValidation");

// Register User
router.post("/register", validate(registerSchema), registerUser);

// login Users
router.post("/login", validate(loginSchema), loginUser);

// refresh token
router.post("/refresh", validate(refreshSchema), refreshToken);

module.exports = router;
