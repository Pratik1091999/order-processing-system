const config = require("./config/config");
const connectDB = require("./db/index");
const app = require("./app");
const processSQSMessages = require("./services/sqsConsumer");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Start processing SQS messages
console.log("🚀 Starting SQS message processor...");
setInterval(processSQSMessages, 5000);

// Start the server
const PORT = config.app.port;
app.listen(PORT, () => {
  console.log(`⚙️ Server is running on port ${PORT}`);
});

connectDB()
  .then(() => {})
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
