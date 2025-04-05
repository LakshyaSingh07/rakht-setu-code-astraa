import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-primary-200 focus:outline-none"
      >
        <div className="flex justify-center items-center w-8 h-8 text-white rounded-full bg-primary-500">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span>{user?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 py-1 mt-2 w-48 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg">
          <button
            onClick={() => navigate('/profile')}
            className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            Your Profile
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 w-full text-sm text-left text-red-700 hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;