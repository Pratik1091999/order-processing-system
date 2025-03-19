const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true, collection: "inventory" });  // 👈 Ensure correct collection name

module.exports = mongoose.model("Inventory", InventorySchema);
