import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Toast from '../components/Toast';
import bloodDropIcon from '../assets/blood-drop.svg';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    bloodGroup: '',
    location: {
      address: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const token = localStorage.getItem('token');

  // Fetch user data and history
  useEffect(() => {
    if (!user) return;

    // Set initial form data from user object
    setFormData({
      name: user.name || '',
      email: user.email || '',
      age: user.age || '',
      bloodGroup: user.bloodGroup || '',
      location: {
        address: user.location?.address || ''
      }
    });

    // Fetch user's donation history
    if (user.role === 'donor') {
      axios
        .get('http://localhost:5000/api/donations/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDonations(res.data);
        })
        .catch((err) => {
          console.error('Error fetching donations:', err);
          showToastMessage('Failed to load donation history', 'error');
        });
    }

    // Fetch user's request history if they are a recipient
    if (user.role === 'recipient') {
      axios
        .get('http://localhost:5000/api/requests/user', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setRequests(res.data);
        })
        .catch((err) => {
          console.error('Error fetching requests:', err);
          showToastMessage('Failed to load request history', 'error');
        });
    }

    setLoading(false);
  }, [user, token]);

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Since there's no update profile endpoint in the API yet, we'll just show a success message
      // In a real app, you would make an API call to update the user profile
      showToastMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      showToastMessage(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-red-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.role === 'donor' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'}`}>
              {user.role === 'donor' ? 'Blood Donor' : 'Blood Recipient'}
            </span>
          </div>
        </div>

        {showToast && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setShowToast(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-soft p-6 mb-6 relative overflow-hidden mx-1">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <img src={bloodDropIcon} alt="" className="w-full h-full" />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{user.name || 'User'}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="mt-2 flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm text-gray-600">Active Account</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${isEditing ? 'bg-gray-200 text-gray-700' : 'bg-primary-50 text-primary-700'}`}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label font-medium">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field bg-gray-100 cursor-not-allowed"
                        required
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label font-medium">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        min="18"
                      />
                    </div>
                    <div>
                      <label className="form-label font-medium">Blood Group</label>
                      <input
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="input-field focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g. A+, B-, O+"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="form-label font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.location.address}
                      onChange={handleChange}
                      className="input-field focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your address"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button type="submit" className="btn-primary flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{user.name || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-secondary-500">
                      <h3 className="text-sm font-medium text-gray-500">Age</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{user.age || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-secondary-500">
                      <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                      <div className="flex items-center mt-1">
                        {user.bloodGroup && (
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-800 font-bold mr-2">
                            {user.bloodGroup}
                          </span>
                        )}
                        <p className="text-lg font-medium text-gray-900">{user.bloodGroup || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{user.location?.address || 'Not provided'}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                    <h3 className="text-sm font-medium text-gray-500">Role</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${user.role === 'donor' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'} mr-2`}>
                        {user.role === 'donor' ? 'D' : 'R'}
                      </span>
                      <p className="text-lg font-medium capitalize text-gray-900">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* History Section */}
            <div className="bg-white rounded-xl shadow-soft p-6 relative overflow-hidden mx-1">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                <img src={bloodDropIcon} alt="" className="w-full h-full" />
              </div>
              
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${user.role === 'donor' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {user.role === 'donor' ? 'Donation History' : 'Request History'}
                </h2>
              </div>

              {user.role === 'donor' && (
                <div className="overflow-x-auto">
                  {donations.length > 0 ? (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {donations.map((donation, index) => (
                            <tr key={donation._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(donation.createdAt)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="w-8 h-8 rounded-full bg-red-100 text-red-800 flex items-center justify-center font-bold text-xs mr-2">
                                    {donation.bloodGroup}
                                  </span>
                                  <span className="text-sm text-gray-900">{donation.bloodGroup}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {donation.units} {donation.units > 1 ? 'units' : 'unit'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                  donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {donation.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-gray-500 text-lg">No donation history found.</p>
                      <p className="text-gray-400 mt-2">Your donation records will appear here once you donate blood.</p>
                    </div>
                  )}
                </div>
              )}

              {user.role === 'recipient' && (
                <div className="overflow-x-auto">
                  {requests.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request) => (
                          <tr key={request._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(request.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.bloodGroup}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.units}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                request.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">No request history found.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Settings */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-soft p-6 mx-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Change Password
                </button>
                {user.role === 'donor' && (
                  <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Update Donation Preferences
                  </button>
                )}
                <button className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;