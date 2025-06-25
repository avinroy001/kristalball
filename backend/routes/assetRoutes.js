const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

// Add asset
router.post("/", async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.status(201).json(asset);
});

// Get all assets with optional filters
router.get("/", async (req, res) => {
  const filters = req.query;
  const assets = await Asset.find(filters);
  res.json(assets);
});

module.exports = router;