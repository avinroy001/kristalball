const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

router.post("/", async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.status(201).json(asset);
});

router.get("/", async (req, res) => {
  const filters = req.query;
  const assets = await Asset.find(filters);
  res.json(assets);
});

module.exports = router;