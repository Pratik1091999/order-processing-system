require('dotenv').config();

const AWS = require("aws-sdk");

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const sqs = new AWS.SQS(awsConfig);
const ses = new AWS.SES(awsConfig);

module.exports = { sqs, ses };
