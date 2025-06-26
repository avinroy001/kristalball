const mongoose = require("mongoose");

const movementSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  type: {
  type: String,
  enum: ["purchase", "transfer_in", "transfer_out", "assignment", "expenditure"]
},
  from: String,
  to: String,
  quantity: Number,
  date: { type: Date, default: Date.now },
});

if (mongoose.models.Movement) {
  module.exports = mongoose.model("Movement");
} else {
  module.exports = mongoose.model("Movement", movementSchema);
}
