const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  type: String,
  model: String,
  quantity: Number,
  base: String,
  assignedTo: [
    {
      personnel: String,
      quantity: Number,
    },
  ],
  expended: Number,
});

module.exports = mongoose.model("Asset", assetSchema);

// backend/models/Movement.js
// const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  type: { type: String, enum: ["purchase", "transfer", "assignment"] },
  from: String,
  to: String,
  quantity: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movement", movementSchema);
