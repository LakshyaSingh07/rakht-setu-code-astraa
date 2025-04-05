// server/routes/bloodRequestRoutes.js

const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest"); // you’ll create this next
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// @route   POST /api/blood-requests
// @desc    Create new blood request and notify donors
// @access  Private (Add auth later)
router.post("/", async (req, res) => {
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

module.exports = router;
