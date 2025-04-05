import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'
    : 'flex justify-center items-center';

  return (
    <div className={containerClasses}>
      <div 
        className={`rounded-full animate-spin border-t-red-600 border-r-transparent border-b-red-600 border-l-transparent ${sizes[size]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;