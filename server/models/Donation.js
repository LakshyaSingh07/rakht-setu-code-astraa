const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  location: { type: String, required: true },
  availableDate: { type: String, required: true },
  availableTime: { type: String, required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "completed", "rejected"], 
    default: "pending" 
  },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);