const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Donation = require("../models/Donation");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @route   GET /api/donations
// @desc    Get all donations
// @access  Private (Admin only in the future)
router.get("/", auth, async (req, res) => {
  try {
    const donations = await Donation.find().populate("donorId").populate("recipientId").sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/donations/user
// @desc    Get user's donations
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user.id })
      .populate("recipientId")
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { bloodGroup, units, location, availableDate, availableTime } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!bloodGroup) missingFields.push('bloodGroup');
    if (!units) missingFields.push('units');
    if (!location) missingFields.push('location');
    if (!availableDate) missingFields.push('availableDate');
    if (!availableTime) missingFields.push('availableTime');

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
    if (isNaN(unitsNum) || !Number.isInteger(unitsNum) || unitsNum <= 0 || unitsNum > 3) {
      return res.status(400).json({
        message: "Invalid units value",
        details: "Units must be a positive integer between 1 and 3"
      });
    }

    // Create new donation
    const donation = new Donation({
      bloodGroup,
      units: unitsNum,
      location,
      availableDate,
      availableTime,
      donorId: req.user.id
    });

    await donation.save();

    // Find recipients who might need this blood type
    const potentialRecipients = await User.find({
      role: "recipient",
      bloodGroup: bloodGroup
    });

    // Notify recipients about the new donation
    potentialRecipients.forEach(recipient => {
      try {
        sendEmail(
          recipient.email,
          "New Blood Donation Available",
          `Good news! A donor has offered ${units} unit(s) of ${bloodGroup} blood available on ${availableDate} at ${availableTime}. Log in to your account to connect with this donor.`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    });

    res.status(201).json({
      message: "Donation offer submitted successfully",
      donation
    });
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/donations/:id
// @desc    Update donation status
// @access  Private (Admin only in the future)
router.put("/:id", auth, async (req, res) => {
  try {
    const { status, recipientId } = req.body;
    
    // Validate status
    const validStatuses = ["pending", "approved", "completed", "rejected"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses
      });
    }

    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Update fields if provided
    if (status) donation.status = status;
    if (recipientId) donation.recipientId = recipientId;
    
    donation.updatedAt = Date.now();
    
    await donation.save();

    // If status changed to approved or completed, notify the donor
    if ((status === "approved" || status === "completed") && donation.donorId) {
      const donor = await User.findById(donation.donorId);
      if (donor && donor.email) {
        try {
          sendEmail(
            donor.email,
            `Your Blood Donation is ${status === "approved" ? "Approved" : "Completed"}`,
            `Thank you for your generosity! Your blood donation (${donation.bloodGroup}, ${donation.units} units) has been ${status === "approved" ? "approved" : "completed"}. ${status === "approved" ? "We'll be in touch soon to arrange the donation." : "Your donation has helped save lives!"}`
          );
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      }
    }

    res.json({
      message: "Donation updated successfully",
      donation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/donations/:id
// @desc    Delete a donation
// @access  Private (Only the donor or admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Check if user is the donor
    if (donation.donorId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this donation" });
    }

    await donation.remove();
    
    res.json({ message: "Donation removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;