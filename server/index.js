const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    // Create default admin user if none exists
    const createDefaultAdmin = require('./utils/createDefaultAdmin');
    createDefaultAdmin();
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Life Bridge API");
});

app.use("/api/auth", authRoutes);

const requestRoutes = require("./routes/requests");
const pickupRoutes = require("./routes/pickup");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const donationRoutes = require("./routes/donations");
const adminRoutes = require("./routes/admin");

app.use("/api/requests", requestRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
