const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const Pickup = require("../models/Pickup");
const sendEmail = require("../utils/sendEmail");

// Get all requests
router.get("/", auth, async (req, res) => {
  try {
    // Get query parameters
    const { bloodGroup, excludeCompletedPickups } = req.query;
    
    // Fetch all requests with their requestedBy information
    let requests = await BloodRequest.find().populate("requestedBy");
    
    // Filter by blood group if specified
    if (bloodGroup) {
      requests = requests.filter(request => request.bloodGroup === bloodGroup);
    }
    
    // Filter out requests with completed pickups if specified
    if (excludeCompletedPickups === 'true') {
      // Get all completed pickups
      const completedPickups = await Pickup.find({ status: 'completed' });
      const completedRequestIds = completedPickups.map(pickup => pickup.request.toString());
      
      // Filter out requests that have completed pickups
      requests = requests.filter(request => !completedRequestIds.includes(request._id.toString()));
    }
    
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create request
router.post("/", auth, async (req, res) => {
  try {
    const { bloodGroup, units, location } = req.body;

    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!bloodGroup) missingFields.push('bloodGroup');
    if (!units) missingFields.push('units');
    if (!location) missingFields.push('location');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields
      });
    }

    // Validate blood group format
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        message: "Invalid blood group",
        validGroups: validBloodGroups
      });
    }

    // Validate units with type checking
    const unitsNum = Number(units);
    if (isNaN(unitsNum) || !Number.isInteger(unitsNum) || unitsNum <= 0) {
      return res.status(400).json({
        message: "Invalid units value",
        details: "Units must be a positive integer"
      });
    }

    // Validate location length
    if (typeof location !== 'string' || location.trim().length < 3) {
      return res.status(400).json({
        message: "Invalid location",
        details: "Location must be a string with at least 3 characters"
      });
    }

    const request = new BloodRequest({
      requestedBy: req.user._id,
      bloodGroup,
      units,
      location,
    });

    await request.save();

    // find donors (simple: all users except requester)
    const donors = await User.find({ _id: { $ne: req.user._id } });

    const emailPromises = donors.map(donor => 
      sendEmail(
        donor.email,
        "🚨 Blood Request Alert",
        `Hello ${donor.name},\n\nA new blood request has been made:\n\nBlood Group: ${bloodGroup}\nUnits: ${units}\nLocation: ${location}\n\nPlease login to Life Bridge if you're available to donate.`
      )
    );

    await Promise.all(emailPromises);

    res.status(201).json({ 
      message: "Request submitted and donors notified!",
      request: await BloodRequest.findById(request._id).populate('requestedBy')
    });
  } catch (error) {
    console.error("Error submitting request:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
