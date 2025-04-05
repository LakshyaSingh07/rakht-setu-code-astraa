import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { useAuth } from "../context/AuthContext";

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
