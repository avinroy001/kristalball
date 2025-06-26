const express = require("express");
const Asset = require("../models/Asset");
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { base, equipmentType, quantity, date } = req.body;
    let asset = await Asset.findOne({ type: equipmentType, base });
    if (!asset) {
      asset = new Asset({ type: equipmentType, base, quantity: 0, assignedTo: [], expended: 0 });
    }
    asset.quantity += Number(quantity);
    await asset.save();
    res.status(201).json({ base, equipmentType, quantity, date });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    const purchases = assets.map(a => ({
      base: a.base,
      equipmentType: a.type,
      quantity: a.quantity,
    }));
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
