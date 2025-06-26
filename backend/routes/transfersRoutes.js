const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { fromBase, toBase, assetId, date } = req.body;
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    asset.base = toBase;
    await asset.save();
    res.status(201).json({ fromBase, toBase, assetId, date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    const transfers = assets.map(a => ({
      fromBase: "N/A",
      toBase: a.base,
      assetId: a._id,
    }));
    res.json(transfers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
