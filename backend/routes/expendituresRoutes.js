const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { assetId, reason, date } = req.body;
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    asset.expended = (asset.expended || 0) + 1; 
    asset.quantity -= 1;
    await asset.save();
    res.status(201).json({ assetId, reason, date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    let expenditures = [];
    assets.forEach(a => {
      if (a.expended) {
        expenditures.push({ assetId: a._id, expended: a.expended });
      }
    });
    res.json(expenditures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
