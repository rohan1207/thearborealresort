import React from 'react';

// Skeleton loader for rooms
export const RoomSkeleton = () => (
  <div className="min-h-screen bg-[#f8f6f0] pt-16 sm:pt-18 md:pt-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-64 sm:h-96 bg-gray-200 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton loader for blog listing
export const BlogSkeleton = () => (
  <div className="bg-[#f5f3ed] min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Generic skeleton loader
export const GenericSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded ${
          i === lines - 1 ? 'w-5/6' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

// Card skeleton
export const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm p-6">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);




















