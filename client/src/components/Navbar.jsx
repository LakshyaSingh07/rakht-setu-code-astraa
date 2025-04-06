import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from "./UserMenu";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <nav className="px-6 py-4 text-white bg-gradient-to-r shadow-lg from-primary-600 to-primary-700">
      <div className="flex justify-between items-center container-custom">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold tracking-tight transition-colors hover:text-primary-200">
            Rakht Setu
          </Link>
          <div className="hidden space-x-6 md:flex">
            <Link to="/dashboard" className="text-white nav-link hover:text-primary-200">
              Dashboard
            </Link>
            <Link to="/donations" className="text-white nav-link hover:text-primary-200">
              Donations
            </Link>
            <Link to="/requests" className="text-white nav-link hover:text-primary-200">
              Requests
            </Link>
            <Link to="/about" className="text-white nav-link hover:text-primary-200">
              About
            </Link>
            {user && user.isAdmin && (
              <Link to="/admin" className="text-white nav-link hover:text-primary-200 flex items-center">
                <span>Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.021A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <UserMenu user={user} />
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-white rounded-lg transition-colors text-primary-600 hover:bg-primary-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
