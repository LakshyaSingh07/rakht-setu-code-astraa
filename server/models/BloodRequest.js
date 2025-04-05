// server/models/BloodRequest.js

const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  location: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
