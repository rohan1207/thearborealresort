import React from 'react';

const AboutText = () => {
  return (
    <div className="w-full lg:w-1/2 p-8 lg:p-16">
      <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-4">ABOUT US</h1>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-6">
        We don’t take ourselves too seriously, but we are dead serious about delivering results.
      </h2>
      <p className="text-gray-500 mb-8">
        Data fuels everything we do, but we aren’t robots—we’re humans with heart, dedicated to the successes of our clients and each other.
      </p>
      <button className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-md shadow-md hover:bg-pink-500 transition-colors duration-300 flex items-center">
        Open Positions <span className="ml-2">→</span>
      </button>
    </div>
  );
};

export default AboutText;
