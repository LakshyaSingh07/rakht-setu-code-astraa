import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const DonateBlood = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("1");
  const [location, setLocation] = useState("");
  const [availableDate, setAvailableDate] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // If user has a blood group, pre-fill it
    if (user?.bloodGroup) {
      setBloodGroup(user.bloodGroup);
    }

    // Try to get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.log("Location error:", error.message);
        }
      );
    }
  }, [user]);

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const missingFields = [];
    if (!bloodGroup) missingFields.push('Blood Group');
    if (!units) missingFields.push('Units');
    if (!location) missingFields.push('Location');
    if (!availableDate) missingFields.push('Available Date');
    if (!availableTime) missingFields.push('Available Time');

    if (missingFields.length > 0) {
      showToast(`Please fill in the following required fields: ${missingFields.join(', ')}`, "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/donations",
        { 
          bloodGroup, 
          units: parseInt(units), 
          location,
          availableDate,
          availableTime,
          donorId: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      showToast("Thank you for your donation offer! We'll contact you soon to arrange the pickup.", "success");
      setUnits("1");
      setAvailableDate("");
      setAvailableTime("");
    } catch (error) {
      console.error("Error submitting donation:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit donation";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 mx-auto mt-10 max-w-md bg-white rounded-xl shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-center text-red-700">
        Donate Blood
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleDonate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Units to Donate</label>
            <input
              type="number"
              min="1"
              max="3"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="Enter number of units"
              className="p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Maximum 3 units per donation</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Your Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Fetching location..."
              className="p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Available Date</label>
            <input
              type="date"
              min={getTomorrowDate()}
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Available Time</label>
            <input
              type="time"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              className="p-2 w-full text-gray-700 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="py-3 w-full text-white bg-red-700 rounded-lg transition-colors duration-300 hover:bg-red-800 focus:ring-4 focus:ring-red-300"
          >
            Submit Donation
          </button>
        </form>
      )}
      
      <div className="p-4 mt-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-700">Important Information</h3>
        <ul className="mt-2 space-y-2 text-sm list-disc list-inside text-gray-700">
          <li>You must be at least 18 years old to donate blood</li>
          <li>You must weigh at least 110 pounds (50 kg)</li>
          <li>You must be in good health and feeling well</li>
          <li>You must wait at least 56 days between whole blood donations</li>
          <li>A medical professional will assess your eligibility before donation</li>
        </ul>
      </div>
    </div>
  );
};

export default DonateBlood;