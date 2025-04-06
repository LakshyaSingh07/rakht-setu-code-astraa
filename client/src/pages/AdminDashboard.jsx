import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pickups');
  const [pickups, setPickups] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // API Constants
  const API_BASE_URL = 'http://localhost:5000';
  const ENDPOINTS = {
    PICKUPS: `${API_BASE_URL}/api/admin/pickups`,
    DONATIONS: `${API_BASE_URL}/api/admin/donations`,
    REQUESTS: `${API_BASE_URL}/api/admin/requests`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
  };

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Fetch stats for all tabs
        const statsResponse = await axios.get(ENDPOINTS.STATS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsResponse.data);

        // Fetch data for active tab
        switch (activeTab) {
          case 'pickups':
            const pickupsResponse = await axios.get(ENDPOINTS.PICKUPS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setPickups(pickupsResponse.data);
            break;
          case 'donations':
            const donationsResponse = await axios.get(ENDPOINTS.DONATIONS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setDonations(donationsResponse.data);
            break;
          case 'requests':
            const requestsResponse = await axios.get(ENDPOINTS.REQUESTS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(requestsResponse.data);
            break;
          case 'users':
            const usersResponse = await axios.get(ENDPOINTS.USERS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(usersResponse.data);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Failed to load ${activeTab}. ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, token, user]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleUpdatePickupStatus = async (id, status) => {
    try {
      await axios.put(
        `${ENDPOINTS.PICKUPS}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setPickups(pickups.map(pickup => 
        pickup._id === id ? { ...pickup, status } : pickup
      ));

      showToastMessage(`Pickup status updated to ${status}`);
    } catch (err) {
      console.error('Error updating pickup status:', err);
      showToastMessage(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleUpdateDonationStatus = async (id, status) => {
    try {
      await axios.put(
        `${ENDPOINTS.DONATIONS}/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setDonations(donations.map(donation => 
        donation._id === id ? { ...donation, status } : donation
      ));

      showToastMessage(`Donation status updated to ${status}`);
    } catch (err) {
      console.error('Error updating donation status:', err);
      showToastMessage(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleToggleAdminStatus = async (id, currentStatus) => {
    try {
      await axios.put(
        `${ENDPOINTS.USERS}/${id}`,
        { isAdmin: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setUsers(users.map(user => 
        user._id === id ? { ...user, isAdmin: !currentStatus } : user
      ));

      showToastMessage(`User admin status updated`);
    } catch (err) {
      console.error('Error updating user admin status:', err);
      showToastMessage(err.response?.data?.message || 'Failed to update admin status', 'error');
    }
  };

  const getFilteredData = (data, filterType) => {
    if (!statusFilter) return data;
    return data.filter(item => item.status === statusFilter);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!user.isAdmin) {
    return <div className="container mx-auto p-4">Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Users</h3>
              <div className="mt-2 flex justify-between">
                <span>Total: {stats.users.total}</span>
                <span>Donors: {stats.users.donors}</span>
                <span>Recipients: {stats.users.recipients}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Donations</h3>
              <div className="mt-2 flex justify-between">
                <span>Total: {stats.donations.total}</span>
                <span>Completed: {stats.donations.completed}</span>
                <span>Pending: {stats.donations.pending}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Pickups</h3>
              <div className="mt-2 flex justify-between">
                <span>Total: {stats.pickups.total}</span>
                <span>Completed: {stats.pickups.completed}</span>
                <span>Scheduled: {stats.pickups.scheduled}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700">Requests</h3>
              <div className="mt-2">
                <span>Total: {stats.requests.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pickups')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'pickups' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Pickups
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'donations' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Donations
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Requests
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'users' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Users
            </button>
          </nav>
        </div>

        {/* Status Filter */}
        {activeTab !== 'users' && activeTab !== 'requests' && (
          <div className="mb-6">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              {activeTab === 'pickups' ? (
                <>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Content based on active tab */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : (
            <>
              {/* Pickups Tab */}
              {activeTab === 'pickups' && (
                <ul className="divide-y divide-gray-200">
                  {getFilteredData(pickups, 'status').length > 0 ? (
                    getFilteredData(pickups, 'status').map((pickup) => (
                      <li key={pickup._id} className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">
                              Donor: {pickup.donor?.name || 'Unknown'}
                            </h3>
                            <p className="text-gray-600">
                              Blood Group: {pickup.request?.bloodGroup || 'Unknown'}
                            </p>
                            <p className="text-gray-600">
                              Date: {pickup.date}, Time: {pickup.time}
                            </p>
                            <p className="text-gray-600">
                              Location: {pickup.location}
                            </p>
                            <p className="text-gray-600">
                              Recipient: {pickup.request?.requestedBy?.name || 'Unknown'}
                            </p>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pickup.status === 'completed' ? 'bg-green-100 text-green-800' :
                                pickup.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {pickup.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleUpdatePickupStatus(pickup._id, 'completed')}
                              disabled={pickup.status === 'completed'}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleUpdatePickupStatus(pickup._id, 'cancelled')}
                              disabled={pickup.status === 'cancelled' || pickup.status === 'completed'}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Cancel Pickup
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">No pickups found</li>
                  )}
                </ul>
              )}

              {/* Donations Tab */}
              {activeTab === 'donations' && (
                <ul className="divide-y divide-gray-200">
                  {getFilteredData(donations, 'status').length > 0 ? (
                    getFilteredData(donations, 'status').map((donation) => (
                      <li key={donation._id} className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">
                              Donor: {donation.donorId?.name || 'Unknown'}
                            </h3>
                            <p className="text-gray-600">
                              Blood Group: {donation.bloodGroup}
                            </p>
                            <p className="text-gray-600">
                              Units: {donation.units}
                            </p>
                            <p className="text-gray-600">
                              Available: {donation.availableDate} at {donation.availableTime}
                            </p>
                            <p className="text-gray-600">
                              Location: {donation.location}
                            </p>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                donation.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                donation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {donation.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleUpdateDonationStatus(donation._id, 'approved')}
                              disabled={donation.status !== 'pending'}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateDonationStatus(donation._id, 'completed')}
                              disabled={donation.status !== 'approved'}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleUpdateDonationStatus(donation._id, 'rejected')}
                              disabled={donation.status === 'rejected' || donation.status === 'completed'}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">No donations found</li>
                  )}
                </ul>
              )}

              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <ul className="divide-y divide-gray-200">
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <li key={request._id} className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Requester: {request.requestedBy?.name || 'Unknown'}
                            </h3>
                            <p className="text-gray-600">
                              Blood Group: {request.bloodGroup}
                            </p>
                            <p className="text-gray-600">
                              Units: {request.units}
                            </p>
                            <p className="text-gray-600">
                              Location: {request.location}
                            </p>
                            <p className="text-gray-600">
                              Date Requested: {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">No requests found</li>
                  )}
                </ul>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <ul className="divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <li key={user._id} className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium">{user.name}</h3>
                            <p className="text-gray-600">
                              Email: {user.email}
                            </p>
                            <p className="text-gray-600">
                              Role: {user.role}
                            </p>
                            <p className="text-gray-600">
                              Blood Group: {user.bloodGroup || 'Not specified'}
                            </p>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'Regular User'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => handleToggleAdminStatus(user._id, user.isAdmin)}
                              className={`px-4 py-2 rounded-md ${user.isAdmin ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                            >
                              {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">No users found</li>
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md ${toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white shadow-lg`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;