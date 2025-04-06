import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import LoadingSpinner from "../components/LoadingSpinner";

const RequestBlood = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const { user } = useAuth();
  const { showToast } = useToast();

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
          showToast("Could not fetch your location. Please enter it manually.", "warning");
        }
      );
    }
  }, [user, showToast]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const missingFields = [];
    if (!bloodGroup) missingFields.push('Blood Group');
    if (!units) missingFields.push('Units');
    if (!location) missingFields.push('Location');

    if (missingFields.length > 0) {
      showToast(`Please fill in the following required fields: ${missingFields.join(', ')}`, "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blood-requests",
        { 
          bloodGroup, 
          units: parseInt(units), 
          location
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast("Blood request submitted successfully!", "success");
      setBloodGroup("");
      setUnits("");
      setLocation("");
    } catch (error) {
      console.error("Error requesting blood:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit request";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto mt-10 max-w-md bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden relative">
      {/* Background design elements - subtle gradient and shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-50 rounded-full opacity-50"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-white to-red-50 opacity-50"></div>
      
      <div className="relative"> {/* Relative container to position content above background elements */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-700" viewBox="0 0 384 512">
              <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320C384 426 298 512 192 512z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Request Blood
          </h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleRequest} className="space-y-6">
          <div className="relative mb-6">
            <label className="block mb-3 text-base font-medium text-gray-800">Blood Group</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 384 512">
                  <path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320C384 426 298 512 192 512z" fill="currentColor"/>
                </svg>
              </div>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="pl-10 p-4 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base"
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
          </div>

          <div className="relative mb-6">
            <label className="block mb-3 text-base font-medium text-gray-800">Units Required</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <input
                type="number"
                min="1"
                max="5"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder="Number of units"
                className="pl-10 p-4 w-full text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base"
                required
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Maximum 5 units per request
            </p>
          </div>

          <div className="relative mb-6">
            <label className="block mb-3 text-base font-medium text-gray-800">Location</label>
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Your location"
                className="pl-10 p-4 w-full text-gray-700 bg-white rounded-l-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-base"
                required
              />
              <button 
                type="button" 
                onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation(`${latitude}, ${longitude}`);
                        showToast("Location updated", "success");
                      },
                      (error) => {
                        console.log("Location error:", error.message);
                        showToast("Could not fetch your location", "error");
                      }
                    );
                  }
                }}
                className="flex justify-center items-center px-5 text-white bg-red-600 rounded-r-lg hover:bg-red-700 transition-colors duration-300 shadow-md"
                title="Get current location"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Accurate location helps find donors nearby
            </p>
          </div>

          <button
            type="submit"
            className="py-4 mt-6 w-full text-white bg-red-600 rounded-lg transition-all duration-300 hover:bg-red-700 focus:ring-4 focus:ring-red-300 shadow-md hover:shadow-lg flex items-center justify-center text-lg font-medium"
          >
            Submit Request
          </button>
        </form>
      )}
      </div>
      
      <div className="p-5 mt-8 bg-red-50 rounded-lg border border-red-100 shadow-sm relative overflow-hidden">
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red-100 rounded-full opacity-50"></div>
        <div className="relative">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-red-700">Important Information</h3>
          </div>
          <ul className="mt-2 space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your request will be matched with available donors
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You will be notified when a match is found
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Emergency requests are prioritized
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Please provide accurate location information for faster processing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;
