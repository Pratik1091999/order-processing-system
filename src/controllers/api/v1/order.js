const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../../utils/logger");
const ApiResponse = require("../../../utils/apiResponse");
const ApiError = require("../../../utils/apiError");
const asyncHandler = require("../../../utils/asyncHandler");
const OrderModel = require("../../../models/order");
const InventoryModel = require("../../../models/inventory");
const ProductModel = require("../../../models/product");
const { sqs } = require("../../../utils/awsConfig");
const { setRedis } = require("../../../utils/redisConfig");

const createOrder = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return next(new ApiError(400, "No items in order"));
  }

  // Extract productIds
  const productIds = items.map((item) => item.productId);

  // Fetch all products & inventory in a single query
  const [products, inventories] = await Promise.all([
    ProductModel.find({ _id: { $in: productIds } }).lean(),
    InventoryModel.find({ productId: { $in: productIds } }).lean(),
  ]);

  if (!products.length) {
    return next(new ApiError(400, "No valid products found"));
  }

  // Convert to Maps
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));
  const inventoryMap = new Map(inventories.map((inv) => [inv.productId.toString(), inv]));

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    const inventory = inventoryMap.get(item.productId);

    if (!product) {
      return next(new ApiError(400, `Product with ID ${item.productId} not found`));
    }

    if (!inventory) {
      return next(new ApiError(400, `Inventory not found for product ID ${item.productId}`));
    }

    if (inventory.stock < item.quantity) {
      return next(new ApiError(400, `Product ${product.name} is out of stock`));
    }

    const productPrice = Number(product.price);
    const productQuantity = Number(item.quantity);

    totalAmount += productPrice * productQuantity;
    orderItems.push({
      productId: product._id,
      name: product.name,
      quantity: productQuantity,
      price: productPrice,
    });
  }

  // Create Order
  const order = await OrderModel.create({
    orderId: uuidv4(),
    userId,
    items: orderItems,
    totalAmount,
  });

  // Bulk update inventory stock
  await InventoryModel.bulkWrite(
    items.map((item) => ({
      updateOne: {
        filter: { productId: item.productId },
        update: { $inc: { stock: -item.quantity } },
      },
    }))
  );

  // Push Order to AWS SQS
  const sqsParams = {
    MessageBody: JSON.stringify({ orderId: order.orderId, userId }),
    QueueUrl: process.env.AWS_SQS_QUEUE_URL,
  };
  await sqs.sendMessage(sqsParams).promise();

  // Cache Order in Redis
  await setRedis(`order:${order.orderId}`, order, 600);

  return res.status(201).json(new ApiResponse(201, "Order placed successfully", order));
});

//  Get Order by ID
const getOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Fetch from MongoDB
  const order = await OrderModel.findOne({ orderId: id }).populate("items.productId");
  if (!order) {
    return next(new ApiError(404, "Order not found"));
  }

  return res.status(200).json(new ApiResponse(200, "Order retrieved successfully", order));
});

module.exports = { createOrder, getOrder };
