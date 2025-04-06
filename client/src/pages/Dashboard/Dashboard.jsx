import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Hero from "../../components/Hero";
import RequestCard from "../../components/RequestCard";
import DonationCard from "../../components/DonationCard";
import SchedulePickup from "../../components/SchedulePickup";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";

// API Constants
const API_BASE_URL = "http://localhost:5000";
const ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth/me`,
  REQUESTS: `${API_BASE_URL}/api/requests`,
  PICKUPS: `${API_BASE_URL}/api/pickups`,
  USER_DONATIONS: `${API_BASE_URL}/api/donations/user`,
  DONATIONS: `${API_BASE_URL}/api/donations`,
};

export default function Dashboard() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [location, setLocation] = useState("");
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeRequests: 0,
    livesImpacted: 0,
  });

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState(
    user?.role === "donor" ? "donations" : "requests"
  );
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const token = localStorage.getItem("token");

  // Authentication is now handled by the ProtectedRoute component

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    if (user.role === "donor") {
      // Fetch blood requests
      axios
        .get(ENDPOINTS.REQUESTS, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            bloodGroup: bloodGroupFilter || undefined,
            excludeCompletedPickups: true, // Add parameter to exclude requests with completed pickups
          },
        })
        .then((res) => {
          setRequests(res.data);
          setTotalPages(Math.ceil(res.data.length / itemsPerPage));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));

      // Fetch user's donation history
      axios
        .get(ENDPOINTS.USER_DONATIONS, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDonations(res.data);
        })
        .catch((err) => console.error("Error fetching donations:", err));
    }
  }, [user, bloodGroupFilter]);

  useEffect(() => {
    // Calculate stats based on requests and donations
    // In a real app, this would come from your API
    const completedDonations = donations.filter(
      (d) => d.status === "completed"
    ).length;

    setStats({
      totalDonations: completedDonations,
      activeRequests: requests.length,
      livesImpacted: completedDonations * 3, // Each donation can help up to 3 people
    });
  }, [requests, donations]);

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleFilterChange = (e) => {
    setBloodGroupFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getPaginatedData = (data) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) return <p className="text-red-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero stats={stats} />

      <div className="items-center justify-center py-8 container-custom px-4 sm:px-6 lg:px-8">
        {user.role === "recipient" ? (
          <>
            <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">
              Request Blood
            </h2>
            <div className="flex items-center justify-center bg-beige-100 px-4">
              <div className="flex items-center max-w-sm bg-white shadow-lg rounded-2xl p-8 w-full">
                <form
                  className="space-y-5 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const bloodGroup = form.bloodGroup.value;
                    const units = form.units.value;

                    if (!location) {
                      showToastMessage("Please provide your location", "error");
                      return;
                    }

                    axios
                      .post(
                        ENDPOINTS.REQUESTS,
                        { bloodGroup, units, location },
                        { headers: { Authorization: `Bearer ${token}` } }
                      )
                      .then(() => {
                        showToastMessage("Request submitted successfully!");
                        form.reset();
                      })
                      .catch((err) =>
                        showToastMessage(err.response.data.message, "error")
                      );
                  }}
                >
                  {/* Blood Group Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="" disabled selected>
                        Select blood group
                      </option>
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

                  {/* Units */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Units Required
                    </label>
                    <input
                      name="units"
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Number of units"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="flex space-x-2">
                      <input
                        name="location"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Your location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if ("geolocation" in navigator) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const { latitude, longitude } = position.coords;
                                setLocation(`${latitude}, ${longitude}`);
                                showToastMessage(
                                  "Location fetched successfully",
                                  "success"
                                );
                              },
                              (error) => {
                                console.log("Location error:", error.message);
                                showToastMessage(
                                  "Failed to get location: " + error.message,
                                  "error"
                                );
                              }
                            );
                          } else {
                            showToastMessage(
                              "Geolocation is not supported by your browser",
                              "error"
                            );
                          }
                        }}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button className="w-full py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Tabs for Donor Dashboard */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "requests"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Blood Requests
                </button>
                <button
                  onClick={() => setActiveTab("donations")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "donations"
                      ? "text-primary-600 border-b-2 border-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Donations
                </button>
              </div>
            </div>

            {activeTab === "requests" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="mb-0 section-title">
                    Blood Requests Near You
                  </h2>
                  <div className="w-48">
                    <select
                      value={bloodGroupFilter}
                      onChange={handleFilterChange}
                      className="p-2 w-full rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Blood Groups</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 animate-spin border-primary-600"></div>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No blood requests found</p>
                    {bloodGroupFilter && (
                      <button
                        onClick={() => setBloodGroupFilter("")}
                        className="mt-2 text-primary-600 hover:underline"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {getPaginatedData(requests).map((request) => (
                        <RequestCard
                          key={request._id}
                          request={request}
                          onDonate={() => setSelectedRequest(request)}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <nav className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 rounded-md ${
                                pageNum === page
                                  ? "bg-primary-600 text-white"
                                  : "border border-gray-300"
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "donations" && (
              <>
                <h2 className="mb-6 section-title">My Donation History</h2>
                {donations.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">
                      You haven't made any donations yet
                    </p>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className="mt-2 text-primary-600 hover:underline"
                    >
                      View available requests
                    </button>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-white rounded-xl shadow-soft">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Blood Group
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Units
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Recipient
                          </th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation._id}>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {formatDate(
                                `${donation.availableDate}T${donation.availableTime}`
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.bloodGroup}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.units}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.recipient?.name || "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  donation.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {donation.status.charAt(0).toUpperCase() +
                                  donation.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {selectedRequest && (
        <SchedulePickup
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onSubmit={async (formData) => {
            try {
              await axios.post(
                ENDPOINTS.PICKUPS,
                {
                  requestId: selectedRequest._id,
                  ...formData,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              showToastMessage("Pickup scheduled successfully!");
              setSelectedRequest(null);
            } catch (err) {
              showToastMessage("Failed to schedule pickup", "error");
            }
          }}
        />
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
