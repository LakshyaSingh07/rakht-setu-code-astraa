import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RequestCard from "../components/RequestCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;
  
  const { user } = useAuth();
  const { showToast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, [bloodGroupFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/blood-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            bloodGroup: bloodGroupFilter || undefined,
          },
        }
      );
      
      setRequests(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blood requests:", error);
      showToast("Failed to load blood requests", "error");
      setLoading(false);
    }
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

  const getFilteredData = () => {
    let filtered = [...requests];
    
    if (bloodGroupFilter) {
      filtered = filtered.filter(request => request.bloodGroup === bloodGroupFilter);
    }
    
    return filtered;
  };

  const handleDonate = (request) => {
    // Navigate to donation page or open donation modal
    showToast("Donation feature coming soon!", "info");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
          <p className="mt-2 text-gray-600">
            View all blood requests and help save lives
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
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
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : getFilteredData().length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">No blood requests found</p>
            {bloodGroupFilter && (
              <button
                onClick={() => {
                  setBloodGroupFilter("");
                }}
                className="mt-2 text-primary-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getPaginatedData(getFilteredData()).map((request) => (
                <RequestCard key={request._id} request={request} onDonate={handleDonate} />
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-md ${pageNum === page ? "bg-primary-600 text-white" : "border border-gray-300"}`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
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
      </div>
    </div>
  );
};

export default Requests;