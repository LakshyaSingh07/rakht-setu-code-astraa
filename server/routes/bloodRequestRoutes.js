// server/routes/bloodRequestRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const BloodRequest = require("../models/BloodRequest"); // you'll create this next
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// @route   POST /api/blood-requests
// @desc    Create new blood request and notify donors
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { bloodGroup, units, location } = req.body;

    const bloodRequest = await BloodRequest.create({
      bloodGroup,
      units,
      location,
      requestedBy: req.user.id
    });

    // Find donors with matching blood group
    const potentialDonors = await User.find({ bloodGroup });

    // Send email to each donor
    potentialDonors.forEach((donor) => {
      sendEmail(
        donor.email,
        "🩸 Blood Donation Request",
        `Urgent need of ${units} unit(s) of ${bloodGroup} blood at ${location}. Please help if you can!`
      );
    });

    res.status(201).json({ message: "Blood request created", bloodRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// @route   GET /api/blood-requests
// @desc    Get all blood requests
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { bloodGroup } = req.query;
    
    // Build filter object
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    
    const bloodRequests = await BloodRequest.find(filter)
      .populate('requestedBy', 'name email hospital')
      .sort({ createdAt: -1 });
      
    res.json(bloodRequests);
  } catch (err) {
    console.error("Error fetching blood requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
