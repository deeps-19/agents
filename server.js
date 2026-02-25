require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const clientRoutes = require("./routes/clientRoutes");
const authRoutes = require("./routes/authRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
const exportRoutes = require("./routes/exportRoutes");
// Middleware FIRST
app.use(cors());
app.use(express.json());

// Then Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/export", exportRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);