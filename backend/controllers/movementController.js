const Movement = require("../models/Movement");
const Asset = require("../models/Asset");
const AuditLog = require("../models/AuditLog"); // Add this model if not already created
const mongoose = require("mongoose");


const logAction = async (req, action, details) => {
  try {
    await AuditLog.create({
      userId: req.user.id,
      role: req.user.role,
      action,
      details: {
        ...details,
        timestamp: new Date(),
      },
    });
  } catch (err) {
    console.error(`Audit logging failed: ${err.message}`);
  }
};


exports.createPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { base, equipmentType, quantity } = req.body;

    if (!base || !equipmentType || !quantity)
      return res.status(400).json({ message: "Missing required fields" });

    let asset = await Asset.findOne({ type: equipmentType, base }).session(session);
    if (!asset) {
      asset = new Asset(
        {
          type: equipmentType,
          base,
          quantity: 0,
          assignedTo: [],
          expended: 0,
        },
        { session }
      );
    }

    asset.quantity += Number(quantity);
    await asset.save({ session });

    const movement = new Movement(
      {
        assetId: asset._id,
        type: "purchase",
        from: base,
        to: null,
        quantity,
      },
      { session }
    );

    await movement.save({ session });

    await session.commitTransaction();

    await logAction(req, "purchase", {
      assetId: asset._id,
      base,
      equipmentType,
      quantity,
    });

    res.status(201).json(movement);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error recording purchase", error: err.message });
  } finally {
    session.endSession();
  }
};


exports.createTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { assetId, from, to, quantity } = req.body;

    if (!assetId || !quantity)
      return res.status(400).json({ message: "Missing required fields" });

    const asset = await Asset.findById(assetId).session(session);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    let type;
    if (!from && to) type = "transfer_in";
    else if (from && !to) type = "transfer_out";
    else type = "transfer";

    if (type === "transfer_out" && asset.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock to transfer" });
    }

    if (type === "transfer_in") {
      asset.quantity += quantity;
    } else if (type === "transfer_out") {
      asset.quantity -= quantity;
    }

    asset.base = to;

    await asset.save({ session });

    const movement = new Movement(
      {
        assetId,
        type,
        from,
        to,
        quantity,
      },
      { session }
    );

    await movement.save({ session });

    await session.commitTransaction();

    await logAction(req, "transfer", {
      assetId,
      from,
      to,
      quantity,
      type,
    });

    res.status(201).json(movement);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error recording transfer", error: err.message });
  } finally {
    session.endSession();
  }
};


exports.createAssignment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { assetId, to, quantity } = req.body;

    const asset = await Asset.findById(assetId).session(session);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (asset.quantity < quantity)
      return res.status(400).json({ message: "Not enough stock to assign" });

    if (!asset.assignedTo) asset.assignedTo = [];
    asset.assignedTo.push({ personnel: to, quantity });
    asset.quantity -= quantity;

    const movement = new Movement(
      {
        assetId,
        type: "assignment",
        from: null,
        to,
        quantity,
      },
      { session }
    );

    await Promise.all([movement.save({ session }), asset.save({ session })]);
    await session.commitTransaction();

    await logAction(req, "assignment", {
      assetId,
      personnel: to,
      quantity,
    });

    res.status(201).json(movement);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error recording assignment", error: err.message });
  } finally {
    session.endSession();
  }
};


exports.recordExpenditure = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { assetId, quantity } = req.body;

    const asset = await Asset.findById(assetId).session(session);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (asset.quantity < quantity)
      return res.status(400).json({ message: "Cannot expend more than available stock" });

    asset.expended = (asset.expended || 0) + quantity;
    asset.quantity -= quantity;

    const movement = new Movement(
      {
        assetId,
        type: "expenditure",
        from: asset.base,
        to: null,
        quantity,
      },
      { session }
    );

    await Promise.all([movement.save({ session }), asset.save({ session })]);
    await session.commitTransaction();

    await logAction(req, "expenditure", {
      assetId,
      quantity,
    });

    res.status(201).json(movement);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error recording expenditure", error: err.message });
  } finally {
    session.endSession();
  }
};


exports.getAllMovements = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const movements = await Movement.find(filter).populate("assetId");
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: "Error fetching movements", error: err.message });
  }
};