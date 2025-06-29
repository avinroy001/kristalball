const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");


const apiRoutes = require("./routes/apiRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


mongoose.connect(
  "mongodb+srv://avinroy001:rVdg0LeVfJuEXGjR@cluster0.1biggfd.mongodb.net/military?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use("/api", apiRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));