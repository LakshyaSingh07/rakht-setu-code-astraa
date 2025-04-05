import React from 'react';

const Hero = ({ stats }) => {
  return (
    <div className="overflow-hidden relative px-6 py-20 mb-12 bg-gradient-to-br from-red-700 via-red-600 to-red-500 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-20 animate-pulse"></div>
      <div className="relative z-10 container-custom">
        <h2 className="mb-12 text-6xl font-black tracking-tight text-center text-white">Blood Donation <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-red-100">Dashboard</span></h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="p-8 text-white bg-gradient-to-br rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 transform group from-white/20 to-white/5 hover:scale-105 hover:from-white/30 hover:to-white/10 border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl transition-colors duration-300 bg-white/10 group-hover:bg-white/20">
                <svg className="w-8 h-8 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm4 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zm-.464 4.95l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707a1 1 0 0 0-1.414 1.414zm2.12-10.607a1 1 0 0 1 0 1.414l-.706.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0zM17 11a1 1 0 1 0 0-2h-1a1 1 0 1 0 0 2h1zm-7 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zM5.05 6.464A1 1 0 1 0 6.465 5.05l-.708-.707a1 1 0 0 0-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414zM4 11a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2h1z"/>
                </svg>
              </div>
              <div>
                <div className="mb-1 text-5xl font-black transition-transform duration-300 animate-fade-in group-hover:scale-110">{stats?.totalDonations || 0}</div>
                <div className="text-sm font-medium text-red-200/80">Total Donations</div>
              </div>
            </div>
          </div>
          <div className="p-8 text-white bg-gradient-to-br rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 transform group from-white/20 to-white/5 hover:scale-105 hover:from-white/30 hover:to-white/10 border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl transition-colors duration-300 bg-white/10 group-hover:bg-white/20">
                <svg className="w-8 h-8 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
                </svg>
              </div>
              <div>
                <div className="mb-1 text-5xl font-black transition-transform duration-300 animate-fade-in group-hover:scale-110">{stats?.activeRequests || 0}</div>
                <div className="text-sm font-medium text-red-200/80">Active Requests</div>
              </div>
            </div>
          </div>
          <div className="p-8 text-white bg-gradient-to-br rounded-2xl border shadow-xl backdrop-blur-xl transition-all duration-300 transform group from-white/20 to-white/5 hover:scale-105 hover:from-white/30 hover:to-white/10 border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl transition-colors duration-300 bg-white/10 group-hover:bg-white/20">
                <svg className="w-8 h-8 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656L10 17.657l-6.828-6.829a4 4 0 0 1 0-5.656z"/>
                </svg>
              </div>
              <div>
                <div className="mb-1 text-5xl font-black transition-transform duration-300 animate-fade-in group-hover:scale-110">{stats?.livesImpacted || 0}</div>
                <div className="text-sm font-medium text-red-200/80">Lives Impacted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;