const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const { protect } = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(
    "mongodb+srv://avinroy001:rVdg0LeVfJuEXGjR@cluster0.1biggfd.mongodb.net/military?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/auth", authRoutes);
app.use("/api/assets", protect, assetRoutes);

app.listen(3001, () => console.log("Server running on port 3001"));
