import React from 'react';

export const ErrorDisplay = ({ error, onRetry, title = "Something went wrong" }) => {
  const isNetworkError = error?.isNetworkError || false;
  const errorMessage = error?.message || 'An unexpected error occurred';

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-[#f5f3ed] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">
          {isNetworkError 
            ? "Unable to connect to the server. Please check your internet connection and try again."
            : errorMessage}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;




















