import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Hero from "../../components/Hero";
import RequestCard from "../../components/RequestCard";
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
  USER_DONATIONS: `${API_BASE_URL}/api/pickups/user`,
};

export default function Dashboard() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeRequests: 0,
    livesImpacted: 0,
  });

  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState("requests");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
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
          params: { bloodGroup: bloodGroupFilter || undefined }
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
          // This is a mock implementation since the endpoint doesn't exist yet
          // In a real app, this would come from the API
          const mockDonations = [
            {
              _id: "1",
              date: "2023-05-15",
              time: "10:30",
              bloodGroup: "A+",
              units: 1,
              recipient: { name: "City Hospital" },
              status: "completed"
            },
            {
              _id: "2",
              date: "2023-06-20",
              time: "14:00",
              bloodGroup: "A+",
              units: 1,
              recipient: { name: "Red Cross Center" },
              status: "completed"
            },
            {
              _id: "3",
              date: "2023-08-05",
              time: "09:15",
              bloodGroup: "A+",
              units: 1,
              recipient: { name: "Community Clinic" },
              status: "pending"
            }
          ];
          setDonations(mockDonations);
        })
        .catch((err) => console.error("Error fetching donations:", err));
    }
  }, [user, bloodGroupFilter]);

  useEffect(() => {
    // Calculate stats based on requests and donations
    // In a real app, this would come from your API
    const completedDonations = donations.filter(d => d.status === "completed").length;
    
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return <p className="text-red-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero stats={stats} />

      <div className="py-8 container-custom">
        {user.role === "recipient" ? (
          <>
            <h2 className="section-title">Request Blood</h2>
            <div className="max-w-lg">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const bloodGroup = form.bloodGroup.value;
                  const units = form.units.value;

                  axios
                    .post(
                      ENDPOINTS.REQUESTS,
                      {
                        bloodGroup,
                        units,
                      },
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
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
                <div>
                  <label className="form-label">Blood Group</label>
                  <input
                    name="bloodGroup"
                    className="input-field"
                    placeholder="e.g. A+, B-, O+"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Units Required</label>
                  <input
                    name="units"
                    className="input-field"
                    type="number"
                    min="1"
                    placeholder="Number of units"
                    required
                  />
                </div>
                <button className="w-full btn-primary">Submit Request</button>
              </form>
            </div>
          </>
        ) : (
          <>
            {/* Tabs for Donor Dashboard */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "requests" ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Blood Requests
                </button>
                <button
                  onClick={() => setActiveTab("donations")}
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "donations" ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  My Donations
                </button>
              </div>
            </div>

            {activeTab === "requests" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="mb-0 section-title">Blood Requests Near You</h2>
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
                        onClick={() => setBloodGroupFilter('')}
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
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 rounded-md ${pageNum === page ? 'bg-primary-600 text-white' : 'border border-gray-300'}`}
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
                    <p className="text-gray-500">You haven't made any donations yet</p>
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
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Blood Group</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Units</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Recipient</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map((donation) => (
                          <tr key={donation._id}>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {formatDate(`${donation.date}T${donation.time}`)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.bloodGroup}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.units}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                              {donation.recipient?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
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
