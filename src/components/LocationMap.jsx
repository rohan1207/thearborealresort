import React from "react";
import { motion } from "framer-motion";

const LocationMap = () => {
  const locationDetails = {
    title: "Getting here",
    address:
      "The Arboreal, Pvt. Road, Gorkhande Apati, Lonavala, Maharashtra 412108",
    mapLink: "https://maps.app.goo.gl/2EL8NXUZgh4An2NL8",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6740519416508!2d73.42024677496694!3d18.67861708244583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be803df3ec90e3b%3A0xf96fb840dcac5cce!2sThe%20Arboreal!5e0!3m2!1sen!2sin!4v1762453871538!5m2!1sen!2sin",
  };

  return (
    <section className="py-12 sm:py-14 md:py-16 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f5f3ed]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-3 sm:mb-4 px-4">
            {locationDetails.title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 font-light tracking-wide px-4">
            {locationDetails.address}
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full bg-white shadow-lg overflow-hidden rounded-lg"
        >
          {/* Map Embed - Responsive height */}
          <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px]">
            <iframe
              src={locationDetails.embedUrl}
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Arboreal Resort Location"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </div>
        </motion.div>

        {/* Get Directions Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mt-6 sm:mt-8 md:mt-12"
        >
          <a
            href={locationDetails.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10 text-xs sm:text-sm tracking-[0.15em] uppercase font-light flex items-center gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Get Directions
            </span>
          </a>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center"
        >
          {/* Distance Info */}
          <div className="space-y-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-900 text-white rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-serif text-gray-900">From Mumbai</h3>
            <p className="text-sm text-gray-600 font-light px-4">
            2½ hours via Mumbai–Pune Expressway
            </p>
          </div>

          {/* Airport Info */}
          <div className="space-y-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-900 text-white rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-serif text-gray-900">
              Nearest Airport
            </h3>
            <p className="text-sm text-gray-600 font-light px-4">
              Pune Airport 30 minutes away
            </p>
          </div>

          {/* Train Info */}
          <div className="space-y-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-900 text-white rounded-full flex items-center justify-center mb-2 sm:mb-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-serif text-gray-900">
              Railway Station
            </h3>
            <p className="text-sm text-gray-600 font-light px-4">
              Lonavala Station 
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationMap;
