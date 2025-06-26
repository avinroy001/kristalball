const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const assetRoutes = require("./assetRoutes");
const movementRoutes = require("./movementRoutes");
const purchasesRoutes = require("./purchasesRoutes");
const transfersRoutes = require("./transfersRoutes");
const assignmentsRoutes = require("./assignmentsRoutes");
const expendituresRoutes = require("./expendituresRoutes");
const dashboardRoutes = require("./dashboardRoutes");

router.use("/dashboard", dashboardRoutes);

router.use("/auth", authRoutes);
router.use("/assets", assetRoutes);
router.use("/movements", movementRoutes);
router.use("/purchases", purchasesRoutes);
router.use("/transfers", transfersRoutes);
router.use("/assignments", assignmentsRoutes);
router.use("/expenditures", expendituresRoutes);

module.exports = router;