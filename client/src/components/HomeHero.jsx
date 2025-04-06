import React from "react";
import { Link } from "react-router-dom";

const HomeHero = () => {
  const stats = [
    { label: "Active Donors", value: "10,000+" },
    { label: "Lives Saved", value: "15,000+" },
    { label: "Blood Centers", value: "100+" },
  ];

  return (
    <div className="overflow-hidden relative bg-white">
      <div className="flex items-center justify-center mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Give the gift of</span>{" "}
                <span className="block text-red-600 xl:inline">life today</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
                Join our community of blood donors and help save lives. Every
                donation counts in making a difference in someone's life.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="flex justify-center items-center px-8 py-3 w-full text-base font-medium text-white bg-red-600 rounded-md border border-transparent hover:bg-red-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Become a Donor
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/about"
                    className="flex justify-center items-center px-8 py-3 w-full text-base font-medium text-red-700 bg-red-100 rounded-md border border-transparent hover:bg-red-200 md:py-4 md:px-10 md:text-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="bg-red-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-red-600">{stat.value}</p>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
