const Movement = require("../models/Movement");
const Asset = require("../models/Asset");

exports.createPurchase = async (req, res) => {
  try {
    const { base, equipmentType, quantity } = req.body;

    let asset = await Asset.findOne({ type: equipmentType, base });
    if (!asset) {
      asset = new Asset({ type: equipmentType, base, quantity: 0 });
    }

    asset.quantity += Number(quantity);
    await asset.save();

    const movement = new Movement({
      assetId: asset._id,
      type: "purchase",
      from: base,
      to: null,
      quantity,
    });

    await movement.save();

    res.status(201).json(movement);
  } catch (err) {
    res.status(500).json({ message: "Error recording purchase", error: err.message });
  }
};

exports.createTransfer = async (req, res) => {
  try {
    const { assetId, from, to, quantity } = req.body;

    let type;
    if (!from && to) type = "transfer_in";
    else if (from && !to) type = "transfer_out";
    else type = "transfer";

    const movement = new Movement({ assetId, type, from, to, quantity });
    await movement.save();

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    if (type === "transfer_in") {
      asset.quantity += quantity;
    } else if (type === "transfer_out") {
      if (asset.quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock to transfer" });
      }
      asset.quantity -= quantity;
    }

    asset.base = to;
    await asset.save();

    res.status(201).json(movement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { assetId, to, quantity } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (asset.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock to assign" });
    }

    if (!asset.assignedTo) asset.assignedTo = [];
    asset.assignedTo.push({ personnel: to, quantity });
    asset.quantity -= quantity;

    const movement = new Movement({
      assetId,
      type: "assignment",
      from: null,
      to,
      quantity,
    });

    await Promise.all([movement.save(), asset.save()]);
    res.status(201).json(movement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.recordExpenditure = async (req, res) => {
  try {
    const { assetId, quantity } = req.body;

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (asset.quantity < quantity) {
      return res.status(400).json({ message: "Cannot expend more than available stock" });
    }

    asset.expended = (asset.expended || 0) + quantity;
    asset.quantity -= quantity;

    const movement = new Movement({
      assetId,
      type: "expenditure",
      from: asset.base,
      to: null,
      quantity,
    });

    await Promise.all([movement.save(), asset.save()]);
    res.status(201).json(movement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMovements = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const movements = await Movement.find(filter).populate("assetId");
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};