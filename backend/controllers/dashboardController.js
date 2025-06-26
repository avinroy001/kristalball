const Asset = require("../models/Asset");
const Movement = require("../models/Movement");

exports.getDashboardStats = async (req, res) => {
  try {
    const [assets, movements] = await Promise.all([
      Asset.find(),
      Movement.find().populate("assetId"),
    ]);

    const totalPurchases = movements
      .filter((m) => m.type === "purchase")
      .reduce((sum, m) => sum + m.quantity, 0);
    const transfersIn = movements
      .filter((m) => m.type === "transfer_in")
      .reduce((sum, m) => sum + m.quantity, 0);
    const transfersOut = movements
      .filter((m) => m.type === "transfer_out")
      .reduce((sum, m) => sum + m.quantity, 0);

    const openingBalance = 100; // Or fetch from DB if needed
    const netMovement = totalPurchases + transfersIn - transfersOut;
    const closingBalance = openingBalance + netMovement;

    const assigned = assets.reduce(
      (sum, a) => sum + ((a.assignedTo || []).length ? a.assignedTo.length : 0),
      0
    );
    const expended = assets.reduce(
      (sum, a) => sum + (a.expended || 0),
      0
    );

    res.json({
      openingBalance,
      closingBalance,
      netMovement,
      purchases: totalPurchases,
      transfersIn,
      transfersOut,
      assigned,
      expended,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};