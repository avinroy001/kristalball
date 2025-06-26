const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { personnelId, assetId, date } = req.body;
    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (!asset.assignedTo) asset.assignedTo = [];
    asset.assignedTo.push({ personnel: personnelId, quantity: 1 }); // Adjust quantity as needed
    await asset.save();
    res.status(201).json({ personnelId, assetId, date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    let assignments = [];
    assets.forEach(a => {
      (a.assignedTo || []).forEach(ass => {
        assignments.push({ assetId: a._id, personnel: ass.personnel, quantity: ass.quantity });
      });
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
