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
