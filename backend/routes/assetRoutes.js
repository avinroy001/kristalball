const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

// Add asset
router.post("/", async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.status(201).json(asset);
});

// Get all assets
router.get("/", async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

module.exports = router;
