import React from "react";
import Card from "./Card";

const DonationCard = ({ donation = {} }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      status={donation.status}
      className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-gray-900">
              {donation.bloodGroup || "Unknown"}
            </h3>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
              {donation.status || "Unknown"}
            </span>
          </div>
          <p className="flex items-center mt-1 text-sm text-gray-500">
            <svg
              className="mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              />
            </svg>
            {donation.date ? `${donation.date} at ${donation.time}` : "Date not specified"}
          </p>
        </div>
        <div className="text-right">
          <div className="flex flex-col justify-center items-center w-16 h-16 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {donation.units || 0}
            </p>
            <p className="text-xs font-medium text-red-600">Units</p>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center w-10 h-10 bg-white rounded-full ring-2 ring-gray-200">
            <span className="text-lg font-semibold text-gray-700">
              {donation.recipient?.name
                ? donation.recipient.name.charAt(0)
                : "R"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {donation.recipient?.name || "Recipient not assigned yet"}
            </p>
            <p className="flex items-center text-xs text-gray-600">
              <svg
                className="mr-1 w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              {donation.location || "Location not specified"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DonationCard;