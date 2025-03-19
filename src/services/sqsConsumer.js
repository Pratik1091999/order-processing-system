require("dotenv").config();
const { sqs } = require("../utils/awsConfig");
const OrderModel= require("../../src/models/order");

const processSQSMessages = async () => {
  const params = {
    QueueUrl: process.env.AWS_SQS_QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10,
    MessageAttributeNames: ["All"],
  };
  try {
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      for (const message of data.Messages) {
        console.log("Received SQS Message:", JSON.parse(message.Body));

        const { orderId, userId } = JSON.parse(message.Body);

        // Validate order existence
        const order = await OrderModel.findOne({ orderId });
        if (!order) {
          console.error(`❌ Order not found: ${orderId}`);
          continue;
        }

        // Simulate order validation (replace with actual logic currently always true)
        const isOrderValid = true

        // Update order status
        order.status = isOrderValid ? "Processed" : "Failed";
        await order.save();
        
        console.log(`Order ${orderId} status updated to: ${order.status}`);
        
        // Delete message after processing
        await sqs
          .deleteMessage({
            QueueUrl: process.env.AWS_SQS_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
          })
          .promise();

        console.log("✅ SQS Message Processed and Deleted");
      }
    }
  } catch (error) {
    console.error("❌ Error Processing SQS Messages:", error);
  }
};

module.exports = processSQSMessages;
