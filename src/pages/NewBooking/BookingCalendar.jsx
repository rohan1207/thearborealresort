import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BookingCalendar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, searchData } = location.state || {};

  const normalize = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(
    searchData?.checkIn ? normalize(searchData.checkIn) : null
  );
  const [selectedCheckOut, setSelectedCheckOut] = useState(
    searchData?.checkOut ? normalize(searchData.checkOut) : null
  );
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  // If no room data, redirect back
  useEffect(() => {
    if (!room || !searchData) {
      navigate("/availability");
    }
  }, [room, searchData, navigate]);

  // Ensure the calendar initially shows the month of the preselected check-in
  useEffect(() => {
    if (selectedCheckIn) {
      setCurrentMonth(
        new Date(selectedCheckIn.getFullYear(), selectedCheckIn.getMonth(), 1)
      );
    }
  }, [selectedCheckIn]);

  if (!room || !searchData) return null;

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  // Get price for a specific date from room data
  const getPriceForDate = (date) => {
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (room.room_rates_info?.inclusive_tax_adjustment?.[dateString]) {
      return room.room_rates_info.inclusive_tax_adjustment[dateString];
    }

    // Return average per night if specific date not found
    return room.room_rates_info?.avg_per_night_after_discount || 0;
  };

  // Check if date is available
  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  // Check if date is in selected range
  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return date >= selectedCheckIn && date <= selectedCheckOut;
  };

  // Handle date click: lock to preselected range, redirect elsewhere
  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (!isDateAvailable(clickedDate)) return;

    // If the date is outside the originally selected range, go back to home to modify search
    if (!isDateInRange(clickedDate)) {
      navigate("/");
      return;
    }
    // Inside range: do nothing (keep preselected dates)
    return;
  };

  // Calculate total nights and price
  const calculateStay = () => {
    if (!selectedCheckIn || !selectedCheckOut)
      return { nights: 0, totalPrice: 0 };

    const timeDiff = selectedCheckOut.getTime() - selectedCheckIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let totalPrice = 0;
    for (let i = 0; i < nights; i++) {
      const date = new Date(selectedCheckIn);
      date.setDate(selectedCheckIn.getDate() + i);
      totalPrice += getPriceForDate(date);
    }

    return { nights, totalPrice };
  };

  const { nights, totalPrice } = calculateStay();

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Navigate to previous month
  const prevMonth = () => {
    const today = new Date();
    const prevMonthDate = new Date(year, month - 1, 1);
    if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonthDate);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleProceed = () => {
    if (!selectedCheckIn || !selectedCheckOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    navigate("/booking/personal-info", {
      state: {
        room,
        searchData: {
          ...searchData,
          checkIn: selectedCheckIn.toISOString().split("T")[0],
          checkOut: selectedCheckOut.toISOString().split("T")[0],
        },
        bookingDetails: {
          checkIn: selectedCheckIn.toISOString().split("T")[0],
          checkOut: selectedCheckOut.toISOString().split("T")[0],
          nights,
          totalPrice,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                1
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900">
                Select Date
              </span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm sm:text-base">
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">
                Personal Information
              </span>
              <span className="ml-1 text-xs font-medium text-gray-500 sm:hidden">
                Info
              </span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold text-sm sm:text-base">
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">
                Booking Confirmation
              </span>
              <span className="ml-1 text-xs font-medium text-gray-500 sm:hidden">
                Confirm
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Dates Locked From Availability
              </h2>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  onClick={prevMonth}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h3 className="text-lg sm:text-xl font-semibold">
                  {monthNames[month]} {year}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-[10px] sm:text-sm font-semibold text-gray-600 py-1 sm:py-2"
                    >
                      {day}
                    </div>
                  )
                )}

                {/* Empty cells for days before month starts */}
                {[...Array(startingDayOfWeek)].map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square"></div>
                ))}

                {/* Calendar days */}
                {[...Array(daysInMonth)].map((_, index) => {
                  const day = index + 1;
                  const date = new Date(year, month, day);
                  date.setHours(0, 0, 0, 0);
                  const price = getPriceForDate(date);
                  const available = isDateAvailable(date);
                  const inRange = isDateInRange(date);
                  const outsideRange = available && !inRange;
                  const isCheckIn =
                    selectedCheckIn &&
                    date.getTime() === selectedCheckIn.getTime();
                  const isCheckOut =
                    selectedCheckOut &&
                    date.getTime() === selectedCheckOut.getTime();

                  return (
                    <motion.button
                      key={day}
                      whileHover={outsideRange ? { scale: 1.05 } : {}}
                      whileTap={outsideRange ? { scale: 0.95 } : {}}
                      onClick={() => handleDateClick(day)}
                      disabled={!available}
                      title={outsideRange ? "Check availability" : ""}
                      className={`
                        group aspect-square rounded-lg p-1 sm:p-2 flex flex-col items-center justify-center text-xs sm:text-sm transition-all
                        ${
                          !available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : ""
                        }
                        ${
                          inRange && !isCheckIn && !isCheckOut
                            ? "bg-amber-100 text-amber-900"
                            : ""
                        }
                        ${
                          isCheckIn || isCheckOut
                            ? "bg-amber-600 text-white font-bold ring-2 ring-amber-700"
                            : ""
                        }
                        ${
                          outsideRange
                            ? "hover:bg-gray-100 cursor-pointer"
                            : ""
                        }
                      `}
                    >
                      <span className="font-semibold text-xs sm:text-sm">{day}</span>
                      {available && (
                        <span className="text-[8px] sm:text-xs mt-0.5 sm:mt-1">
                          {room.currency_sign}
                          {Math.round(price)}
                        </span>
                      )}
                      {outsideRange && (
                        <span className="hidden sm:block text-[9px] mt-0.5 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          Check availability
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selection Instructions */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-900">
                  Your dates from the Availability search are preselected. Hover other dates to
                  see “Check availability”. Clicking those will take you to the home page to modify your dates.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Room Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-8"
            >
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4">
                Booking Summary
              </h3>

              {/* Room Image */}
              {room.room_main_image && (
                <img
                  src={room.room_main_image}
                  alt={room.Room_Name}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 sm:mb-4"
                />
              )}

              {/* Room Details */}
              <h4 className="font-semibold text-base sm:text-lg mb-2">{room.Room_Name}</h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{room.Roomtype_Name}</p>

              {/* Date Selection */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-xs sm:text-sm text-gray-600">Check-in</span>
                  <span className="font-semibold text-xs sm:text-sm">
                    {selectedCheckIn
                      ? selectedCheckIn.toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-xs sm:text-sm text-gray-600">Check-out</span>
                  <span className="font-semibold text-xs sm:text-sm">
                    {selectedCheckOut
                      ? selectedCheckOut.toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-xs sm:text-sm text-gray-600">Nights</span>
                  <span className="font-semibold text-xs sm:text-sm">{nights || 0}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-xs sm:text-sm text-gray-600">Guests</span>
                  <span className="font-semibold text-xs sm:text-sm">
                    {searchData.adults} Adults, {searchData.children || 0}{" "}
                    Children
                  </span>
                </div>
              </div>

              {/* Price Summary */}
              {nights > 0 && (
                <div className="border-t pt-3 sm:pt-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-xs sm:text-sm">
                      Room Rate ({nights} nights)
                    </span>
                    <span className="font-semibold text-xs sm:text-sm">
                      {room.currency_sign}
                      {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span className="text-amber-600">
                      {room.currency_sign}
                      {totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                disabled={!selectedCheckIn || !selectedCheckOut}
                className={`
                  w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base
                  ${
                    selectedCheckIn && selectedCheckOut
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Proceed to Personal Info
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;