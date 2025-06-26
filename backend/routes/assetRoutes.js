const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");

router.get("/", async (req, res) => {
  try {
    const { base, type, page = 1, limit = 10 } = req.query;
    const filters = {};

    if (base) filters.base = base;
    if (type) filters.type = type;

    const skip = (page - 1) * limit;

    const assets = await Asset.find(filters)
      .skip(skip)
      .limit(Number(limit));

    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;