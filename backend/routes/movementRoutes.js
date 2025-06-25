const express = require("express");
const Movement = require("../models/Movement");
const Asset = require("../models/Asset");
const router = express.Router();

router.post("/", async (req, res) => {
  const { assetId, type, from, to, quantity } = req.body;
  const movement = new Movement({ assetId, type, from, to, quantity });
  await movement.save();

  const asset = await Asset.findById(assetId);
  if (type === "purchase") asset.quantity += quantity;
  if (type === "transfer") asset.base = to;
  if (type === "assignment") asset.assignedTo.push({ personnel: to, quantity });
  await asset.save();

  res.status(201).json(movement);
});

router.get("/", async (req, res) => {
  const movements = await Movement.find().populate("assetId");
  res.json(movements);
});

module.exports = router;
