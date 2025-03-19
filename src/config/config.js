require("dotenv").config();

// config.js
module.exports = {
  app: {
    port: parseInt(process.env.PORT) || 5000,
    cors_origin: process.env.CORS_ORIGIN || "*",
  },
  db: {
    database_url: process.env.DB_URL,
    database_name: process.env.DB_NAME,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiresin: process.env.JWT_EXPIRES_IN || "1h",
    saltRounds: parseInt(process.env.SALT_ROUND, 10) || 10,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  },
  aws: {
    region: process.env.AWS_REGION,
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    sqs_queue_url: process.env.SQS_QUEUE_URL,
    ses_sender_email: process.env.SES_SENDER_EMAIL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379, // Ensure it's a number
  },
};
