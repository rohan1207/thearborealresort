import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiUsers,
  FiMaximize,
  FiWifi,
  FiCoffee,
  FiSun,
  FiDroplet,
  FiGrid,
  FiAirplay,
} from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const Availability = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
    rooms: searchParams.get("rooms"),
    adults: searchParams.get("adults"),
    children: searchParams.get("children") || 0,
    name: searchParams.get("name"),
  });

  // Default amenities for all rooms (fallback if not provided by backend)
  const defaultAmenities = [
    { icon: <FiWifi />, name: "Wi-Fi" },
    { icon: <FiSun />, name: "AC" },
    { icon: <FiDroplet />, name: "Bath" },
    { icon: <FiCoffee />, name: "Coffee" },
    { icon: <FiGrid />, name: "Balcony" },
    { icon: <FiAirplay />, name: "TV" },
  ];

  useEffect(() => {
    if (!searchData.checkIn || !searchData.checkOut) {
      navigate("/");
      return;
    }
    searchAvailability();
  }, []);

  const searchAvailability = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/booking/search`, {
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        rooms: parseInt(searchData.rooms),
        adults: parseInt(searchData.adults),
        children: parseInt(searchData.children),
      });

      if (response.data.success) {
        // Ezee API returns the room data directly as an array
        const roomData = response.data.data || [];
        setRooms(roomData);
      } else {
        setError("No rooms available for the selected dates");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch available rooms. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-[#2a2a2a]/5 to-slate-100">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-[#2a2a2a]/30 border-t-[#2a2a2a]/95 rounded-full mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 text-xl font-light tracking-wide"
          >
            Discovering your perfect sanctuary...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-[#2a2a2a]/5 to-slate-100 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center border border-gray-200"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
            We Apologize
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-[#2a2a2a]/95 hover:bg-[#2a2a2a] text-white rounded-full font-medium hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#2a2a2a]/5 to-slate-100 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-10 md:pb-12 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-2 sm:mb-3 tracking-wide px-2">
            Your Perfect Retreat Awaits
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-[#2a2a2a]/95 to-transparent mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full px-4 sm:px-6 py-2 text-[11px] sm:text-sm text-gray-700 shadow-sm text-center">
            <span className="font-medium text-gray-900">All Stays Include</span>: Complimentary breakfast | Free WiFi | Access to pool & common areas | Parking included | Daily housekeeping | Air-conditioned rooms with private balcony/view | Tea & coffee setup
          </div>
        </motion.div>

        {/* Search Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-light text-gray-800 mb-3 sm:mb-4 tracking-wide">
                Your Selection
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a2a2a]/95"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Check In
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {formatDate(searchData.checkIn)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a2a2a]/95"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Check Out
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {formatDate(searchData.checkOut)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a2a2a]/95"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Guests</p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {searchData.adults} Adults
                      {searchData.children > 0 &&
                        `, ${searchData.children} Children`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#2a2a2a]/95"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Duration
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                      {calculateNights()} Night
                      {calculateNights() > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full lg:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-[#2a2a2a]/95 text-[#2a2a2a]/95 rounded-full hover:bg-[#2a2a2a]/95 hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
            >
              Modify Search
            </button>
          </div>
        </motion.div>

        {/* Room Results */}
        {rooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-16 text-center"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-[#2a2a2a]/95"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-3 tracking-wide">
              No Accommodations Available
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
              We apologize, but there are no rooms available for your selected
              dates. Please consider adjusting your travel dates.
            </p>
          </motion.div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-6 sm:mb-8"
            >
              <p className="text-gray-600 text-sm sm:text-base md:text-lg px-4">
                We found{" "}
                <span className="font-semibold text-[#2a2a2a]/95">
                  {rooms.length}
                </span>{" "}
                exquisite accommodation{rooms.length > 1 ? "s" : ""} for your
                stay
              </p>
            </motion.div>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.roomrateunkid || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Image Section */}
                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto lg:min-h-full overflow-hidden">
                      {room.room_main_image ? (
                        <motion.img
                          src={room.room_main_image}
                          alt={room.Room_Name || "Room"}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-[#2a2a2a]/95"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                          </svg>
                        </div>
                      )}
                      {/* Favorite Icon */}
                      <button className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-lg">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-2 p-4 sm:p-5 md:p-6">
                      <div className="flex flex-col h-full">
                        {/* Room Title */}
                        <div className="mb-3 sm:mb-4">
                          <h3 className="text-xl sm:text-2xl font-serif text-[#2a2a2a]/95 mb-1.5 sm:mb-2">
                            {room.Room_Name || room.Roomtype_Name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                            {room.Room_Description ||
                              "Escape to luxury and comfort. This beautifully designed room offers a perfect blend of modern amenities and natural tranquility, ensuring an unforgettable stay in the heart of nature."}
                          </p>
                        </div>

                        {/* Room Info Grid */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                          {/* Adults */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <FiUsers className="text-gray-600 text-base sm:text-lg flex-shrink-0" />
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                Adults: {room.Room_Max_adult || 2}
                              </p>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <FiUsers className="text-gray-600 text-base sm:text-lg flex-shrink-0" />
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                Children: {room.Room_Max_child || 1}
                              </p>
                            </div>
                          </div>

                          {/* Size */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <FiMaximize className="text-gray-600 text-base sm:text-lg flex-shrink-0" />
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                Size: {room.Room_Size || "35"} m²
                              </p>
                            </div>
                          </div>

                          {/* Bed Type */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
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
                            <div>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                Bed: {room.Bed_Type || "Double Bed"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-3 sm:mb-4">
                          <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider mb-1.5 sm:mb-2">
                            Amenities:
                          </p>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {defaultAmenities.map((amenity, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-300 text-xs sm:text-sm"
                                title={amenity.name}
                              >
                                {amenity.icon}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price and Book Button */}
                        <div className="mt-auto flex flex-col md:flex-row items-start md:items-end justify-between pt-3 sm:pt-4 border-t border-gray-200 gap-3 sm:gap-4">
                          <div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">From</p>
                            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-gray-900">
                              {room.currency_sign}
                              {room.room_rates_info?.avg_per_night_after_discount?.toLocaleString() ||
                                "944,850"}
                              <span className="text-xs sm:text-sm text-gray-600 font-normal">
                                {" "}
                                / night
                              </span>
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              navigate("/booking/calendar", {
                                state: {
                                  room,
                                  searchData,
                                },
                              })
                            }
                            className="w-full md:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-[#2a2a2a]/95 hover:bg-[#2a2a2a] text-white text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 font-medium whitespace-nowrap rounded-full"
                          >
                            Book a room
                          </button>
                        </div>

                        {/* Additional Details Link */}
                        <div className="mt-2 sm:mt-3 text-right">
                          <button
                            onClick={() =>
                              navigate("/rooms", {
                                state: {
                                  room: room,
                                  searchData: searchData,
                                },
                              })
                            }
                            className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-900 transition-colors duration-300 flex items-center gap-1 ml-auto"
                          >
                            <span>Additional Details</span>
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;