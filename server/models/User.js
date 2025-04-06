const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  age: Number,
  bloodGroup: String,
  role: { type: String, enum: ["donor", "recipient", "admin"], required: true },
  location: {
    type: { lat: Number, lng: Number },
    address: String,
  },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
