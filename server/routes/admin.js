const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const Pickup = require("../models/Pickup");
const Donation = require("../models/Donation");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// @route   GET /api/admin/pickups
// @desc    Get all pickups
// @access  Admin only
router.get("/pickups", adminAuth, async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .populate({
        path: 'donor',
        select: 'name email bloodGroup'
      })
      .populate({
        path: 'request',
        populate: { path: 'requestedBy', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (err) {
    console.error("Error fetching pickups:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/pickups/:id
// @desc    Update pickup status
// @access  Admin only
router.put("/pickups/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ["scheduled", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses
      });
    }

    const pickup = await Pickup.findById(req.params.id)
      .populate('donor')
      .populate({
        path: 'request',
        populate: { path: 'requestedBy' }
      });
    
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.status = status;
    await pickup.save();

    // If pickup is marked as completed, create a donation record
    if (status === 'completed' && pickup.donor && pickup.request) {
      try {
        // Check if a donation record already exists for this pickup
        const existingDonation = await Donation.findOne({ 
          donorId: pickup.donor._id,
          // Use the pickup date and time as a reference
          availableDate: pickup.date,
          availableTime: pickup.time
        });

        if (!existingDonation) {
          // Create a new donation record
          const donation = new Donation({
            bloodGroup: pickup.request.bloodGroup,
            units: pickup.request.units || 1,
            location: pickup.location,
            availableDate: pickup.date,
            availableTime: pickup.time,
            donorId: pickup.donor._id,
            status: 'completed',
            recipientId: pickup.request.requestedBy._id,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });

          await donation.save();
          console.log('Donation record created for completed pickup:', donation._id);
        }
      } catch (donationError) {
        console.error('Error creating donation record:', donationError);
        // Continue with the response even if donation creation fails
      }
    }

    // Send email notification to donor
    try {
      if (pickup.donor && pickup.donor.email) {
        const statusText = status === 'completed' ? 'completed' : 
                          status === 'cancelled' ? 'cancelled' : 'updated';
        
        await sendEmail(
          pickup.donor.email,
          `Blood Donation Pickup ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
          `Dear ${pickup.donor.name},\n\nYour blood donation pickup has been ${statusText}.\n\nDetails:\nDate: ${pickup.date}\nTime: ${pickup.time}\nLocation: ${pickup.location}\n\nThank you for using Life Bridge!`
        );
      }

      // Send email to requester if pickup is completed
      if (status === 'completed' && pickup.request && pickup.request.requestedBy && pickup.request.requestedBy.email) {
        await sendEmail(
          pickup.request.requestedBy.email,
          "Blood Donation Completed",
          `Dear ${pickup.request.requestedBy.name},\n\nGood news! The blood donation for your request has been completed.\n\nDetails:\nBlood Group: ${pickup.request.bloodGroup}\nUnits: ${pickup.request.units}\n\nThank you for using Life Bridge!`
        );
      }
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue with the response even if email fails
    }

    res.json({
      message: "Pickup status updated successfully",
      pickup
    });
  } catch (err) {
    console.error("Error updating pickup status:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/donations
// @desc    Get all donations
// @access  Admin only
router.get("/donations", adminAuth, async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donorId', 'name email bloodGroup')
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (err) {
    console.error("Error fetching donations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/donations/:id
// @desc    Update donation status
// @access  Admin only
router.put("/donations/:id", adminAuth, async (req, res) => {
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

    const donation = await Donation.findById(req.params.id)
      .populate('donorId');
    
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
      try {
        await sendEmail(
          donation.donorId.email,
          `Your Blood Donation is ${status === "approved" ? "Approved" : "Completed"}`,
          `Thank you for your generosity! Your blood donation (${donation.bloodGroup}, ${donation.units} units) has been ${status === "approved" ? "approved" : "completed"}. ${status === "approved" ? "We'll be in touch soon to arrange the donation." : "Your donation has helped save lives!"}`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }

    res.json({
      message: "Donation updated successfully",
      donation
    });
  } catch (err) {
    console.error("Error updating donation:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/requests
// @desc    Get all blood requests
// @access  Admin only
router.get("/requests", adminAuth, async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('requestedBy', 'name email bloodGroup')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("Error fetching blood requests:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (including making someone admin)
// @access  Admin only
router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update isAdmin status if provided
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
      
      // If making user an admin, also update role if needed
      if (isAdmin && user.role !== "admin") {
        user.role = "admin";
      }
    }
    
    await user.save();

    res.json({
      message: "User updated successfully",
      user: { ...user.toObject(), password: undefined }
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Admin only
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const donorCount = await User.countDocuments({ role: "donor" });
    const recipientCount = await User.countDocuments({ role: "recipient" });
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    const totalDonations = await Donation.countDocuments();
    const completedDonations = await Donation.countDocuments({ status: "completed" });
    const pendingDonations = await Donation.countDocuments({ status: "pending" });
    
    const totalRequests = await BloodRequest.countDocuments();
    
    const totalPickups = await Pickup.countDocuments();
    const completedPickups = await Pickup.countDocuments({ status: "completed" });
    const scheduledPickups = await Pickup.countDocuments({ status: "scheduled" });
    const cancelledPickups = await Pickup.countDocuments({ status: "cancelled" });

    res.json({
      users: {
        total: totalUsers,
        donors: donorCount,
        recipients: recipientCount,
        admins: adminCount
      },
      donations: {
        total: totalDonations,
        completed: completedDonations,
        pending: pendingDonations
      },
      requests: {
        total: totalRequests
      },
      pickups: {
        total: totalPickups,
        completed: completedPickups,
        scheduled: scheduledPickups,
        cancelled: cancelledPickups
      }
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;