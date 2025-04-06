const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.error("Admin auth middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};