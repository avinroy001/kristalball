const express = require("express");
const router = express.Router();


const { protect, authorizeRoles } = require("../middleware/authMiddleware");


const {
  createPurchase,
  createTransfer,
  createAssignment,
  recordExpenditure,
  getAllMovements,
} = require("../controllers/movementController");


router.post(
  "/purchase",
  protect,
  authorizeRoles("admin", "logistics"),
  createPurchase
);


router.post(
  "/transfer",
  protect,
  authorizeRoles("admin", "logistics"),
  createTransfer
);


router.post(
  "/assignment",
  protect,
  authorizeRoles("admin", "commander"),
  createAssignment
);


router.post(
  "/expenditure",
  protect,
  authorizeRoles("admin", "commander"),
  recordExpenditure
);


router.get("/", protect, getAllMovements);

module.exports = router;
