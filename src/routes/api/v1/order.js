const express = require("express");
const router = express.Router();
const { createOrder, getOrder } = require("../../../controllers/api/v1/order");
const authenticate = require("../../../middleware/authMiddleware");
const { registerSchema, loginSchema, refreshSchema, validate } = require("../../../utils/authValidation");

// create Order
router.post("/", authenticate, createOrder);

// get Order
router.get("/:id", authenticate, getOrder);

module.exports = router;
