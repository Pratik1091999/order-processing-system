const mongoose = require("mongoose");
const config = require("../config/config");
const logger = require("../utils/logger"); // Using a logging utility

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.db.database_url, {
      dbName: config.db.database_name,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info(`MongoDB connected: ${connectionInstance.connection.host}`);
    logger.info(`Database Name: ${config.db.database_name}`);

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn(" MongoDB disconnected! Reconnecting...");
      reconnectDB();
    });
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit on failure in production
  }
};

// Reconnection strategy for production
const reconnectDB = () => {
  setTimeout(() => {
    logger.info("♻️ Reattempting MongoDB connection...");
    connectDB();
  }, 5000);
};

module.exports = connectDB;
