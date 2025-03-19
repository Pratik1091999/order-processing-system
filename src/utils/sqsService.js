const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sqs = new AWS.SQS();
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

const pushToSQS = async (order) => {
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(order),
  };

  return sqs.sendMessage(params).promise();
};

module.exports = { pushToSQS };
