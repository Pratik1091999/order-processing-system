const mongoose = require("mongoose");

const EntitySchema = new mongoose.Schema(
  {},
  { timestamps: true },
  { versionKey: false }
);

const Entity = mongoose.model("entityNameUpper", EntitySchema); 

module.exports = Entity;
