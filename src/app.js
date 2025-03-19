// Import required modules
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import custom  required modules
const config = require("./config/config");
const morganMiddleware = require("./middleware/morgan");
const errorHandler = require("../src/middleware/errorHandler");
const app = express();
const userRoutes = require("./routes/api/v1/user");
const orderRoutes = require("./routes/api/v1/order");

// Middleware setup

// Allow Cross-Origin requests
app.use(
  cors({
    origin: config.app.cors_origin,
    credentials: true,
  })
);

// Body parser: parsing JSON data from the request body
app.use(express.json({ limit: "15kb" }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Parse cookies from incoming requests
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());

// Rate limiting: limit requests from the same IP
const limiter = rateLimit({
  max: 150, // maximum number of requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: "Too Many Requests from this IP, please try again in an hour",
});
app.use("/", limiter); // Apply rate limiting to all routes

// Use Morgan middleware for logging HTTP requests
app.use(morganMiddleware);

// Prevent parameter pollution
app.use(hpp());

// Routes setup

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/orders", orderRoutes);

// Error Handling Middleware 
app.use(errorHandler);

// Serve the main HTML file for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Redirect all other requests to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
