import React from "react";
import Card from "./Card";

const RequestCard = ({ request = {}, onDonate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      status={request.status}
      className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-gray-900">
              {request.bloodGroup || "Unknown"}
            </h3>
            <span className="px-2 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-full">
              Blood Required
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
            Posted on{" "}
            {request.createdAt ? formatDate(request.createdAt) : "Unknown date"}
          </p>
        </div>
        <div className="text-right">
          <div className="flex flex-col justify-center items-center w-16 h-16 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">
              {request.units || 0}
            </p>
            <p className="text-xs font-medium text-red-600">Units</p>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6 bg-gray-50 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center w-10 h-10 bg-white rounded-full ring-2 ring-gray-200">
            <span className="text-lg font-semibold text-gray-700">
              {request.requestedBy?.name
                ? request.requestedBy.name.charAt(0)
                : "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {request.requestedBy?.name || "Unknown User"}
            </p>
            <p className="flex items-center text-xs text-gray-600">
              <svg
                className="mr-1 w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z"
                />
              </svg>
              {request.requestedBy?.hospital || "Hospital not specified"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => onDonate(request)}
          className="inline-flex items-center px-6 py-3 text-white rounded-xl font-semibold transition-all duration-300 bg-primary-600 hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            />
          </svg>
          Donate Now
        </button>
      </div>
    </Card>
  );
};

export default RequestCard;
