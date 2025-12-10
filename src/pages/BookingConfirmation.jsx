import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiHome,
  FiCreditCard,
} from "react-icons/fi";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    reservationNo,
    paymentMode,
    paymentId,
    bookingConfirmed,
    bookingDetails,
  } = location.state || {};

  if (!reservationNo || !bookingDetails) {
    navigate("/");
    return null;
  }

  // Normalize data to support both new (multi-room) and old (single-room) flows
  const {
    cart = [],
    room, // legacy single-room flow
    searchData = {},
    personalInfo = {},
    totalAmount,
    email,
    phone,
  } = bookingDetails;

  // If cart is empty but a single room exists (old flow), adapt it
  const normalizedCart =
    cart && cart.length > 0
      ? cart
      : room
      ? [
          {
            id: "single-room",
            room,
            adults: searchData.adults || bookingDetails.adults || 1,
            children: searchData.children || bookingDetails.children || 0,
            total:
              typeof totalAmount === "number"
                ? totalAmount
                : bookingDetails.totalPrice || 0,
          },
        ]
      : [];

  const guestName = personalInfo
    ? `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim()
    : "";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    if (!searchData.checkIn || !searchData.checkOut) return 1;
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalGuests = normalizedCart.reduce(
    (acc, item) => {
      acc.adults += Number(item.adults || 0);
      acc.children += Number(item.children || 0);
      return acc;
    },
    { adults: 0, children: 0 }
  );

  const computedTotal =
    typeof totalAmount === "number"
      ? totalAmount
      : normalizedCart.reduce((sum, item) => sum + (Number(item.total) || 0), 0);

  // Get currency sign from first room, default to ₹
  const currencySign = normalizedCart[0]?.room?.currency_sign || "₹";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white pt-28 pb-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header with Reservation Number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-xl p-4 sm:p-6 mb-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white">
                  Booking Confirmed!
                </h1>
                <p className="text-green-50 text-xs sm:text-sm">
                  Thank you for choosing The Arboreal Resort
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 sm:py-3 text-center border border-white/30">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-green-50 mb-0.5">
                Reservation No.
              </p>
              <p className="text-2xl sm:text-3xl font-serif text-white font-bold">
                {reservationNo}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Booking, Payment, Contact */}
          <div className="lg:col-span-2 space-y-4">
            {/* Booking & Payment Cards Side by Side on Larger Screens */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Booking Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
              <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Booking Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiUser className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Guest Name
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                      {guestName || "Guest"}
                    </p>
                  </div>
                </div>

                {/* Total Rooms & Guests */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiHome className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Rooms & Guests
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">
                      {normalizedCart.length} Room{normalizedCart.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-600">
                      {totalGuests.adults} Adult{totalGuests.adults > 1 ? "s" : ""}
                      {totalGuests.children > 0 &&
                        `, ${totalGuests.children} Child${
                          totalGuests.children > 1 ? "ren" : ""
                        }`}
                    </p>
                  </div>
                </div>

                {/* Check-in */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Check-in
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">
                      {formatDate(searchData.checkIn)}
                    </p>
                    <p className="text-xs text-gray-600">After 2:00 PM</p>
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Check-out
                    </p>
                    <p className="text-sm sm:text-base text-gray-900 font-semibold">
                      {formatDate(searchData.checkOut)}
                    </p>
                    <p className="text-xs text-gray-600">Before 11:00 AM</p>
                  </div>
                </div>
              </div>

                {/* Duration Banner */}
                <div className="mt-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-center gap-2">
                    <FiCalendar className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {calculateNights()} Night{calculateNights() > 1 ? "s" : ""}
                      </span>{" "}
                      Total Stay
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Payment Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
              <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                    Payment Status
                  </span>
                  <span className="font-semibold text-green-700 text-sm">
                    {bookingConfirmed ? "Paid & Confirmed" : "Pending"}
                  </span>
                </div>

                {paymentMode && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <FiCreditCard className="w-4 h-4 text-gray-600" />
                      Payment Method
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {paymentMode}
                    </span>
                  </div>
                )}

                {paymentId && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-1">
                    <span className="text-sm text-gray-700">Payment ID</span>
                    <span className="font-mono text-xs sm:text-sm text-gray-900 break-all">
                      {paymentId}
                    </span>
                  </div>
                )}

                {(typeof totalAmount === "number" || computedTotal > 0) && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mt-3">
                    <span className="text-white font-medium">Total Paid</span>
                    <span className="text-white text-xl font-bold">
                      {currencySign}
                      {(typeof totalAmount === "number" ? totalAmount : computedTotal).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>
              </motion.div>
            </div>

            {/* Detailed Room Breakdown */}
            {normalizedCart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Room Details
                </h2>

                <div className="space-y-4">
                  {normalizedCart.map((cartItem, index) => {
                    const room = cartItem.room;
                    const roomName = room?.Room_Name || room?.Roomtype_Name || "Room";
                    const roomImage = room?.room_main_image;
                    
                    return (
                      <div
                        key={cartItem.id || index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Room Image */}
                          {roomImage && (
                            <div className="sm:w-32 sm:flex-shrink-0">
                              <img
                                src={roomImage}
                                alt={roomName}
                                className="w-full h-32 sm:h-24 object-cover rounded-lg"
                              />
                            </div>
                          )}

                          {/* Room Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                  Room {index + 1}: {roomName}
                                </h3>
                                {room?.Room_Description && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                    {room.Room_Description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Occupancy Details */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                              <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                                  Adults
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {cartItem.adults || 0}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                                  Children
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {cartItem.children || 0}
                                </p>
                              </div>
                              <div className="bg-green-50 rounded-lg p-2 col-span-2 sm:col-span-1">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                                  Room Price
                                </p>
                                <p className="text-sm font-semibold text-green-700">
                                  {currencySign}
                                  {cartItem.total
                                    ? Number(cartItem.total).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })
                                    : "0.00"}
                                </p>
                              </div>
                            </div>

                            {/* Room Amenities */}
                            {room?.RoomAmenities && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                                <p className="text-xs text-gray-700">
                                  {room.RoomAmenities}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Summary */}
                <div className="mt-4 pt-4 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {currencySign}
                      {computedTotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Contact Info Card (full width under booking + payment) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Confirmation Sent To
              </h2>

              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                     <FiMail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 font-medium break-all">
                      {email || personalInfo?.email || "—"}
                    </p>
                  </div>
                </div>

                {(phone || personalInfo?.phone) && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPhone className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {phone || personalInfo?.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Resort Info & Important Notes */}
          <div className="space-y-4">
            {/* Resort Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-xl p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-serif mb-4 pb-3 border-b border-gray-700">
                Resort Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-300" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Address</p>
                    <p className="text-sm text-white leading-relaxed">
                      The Arboreal, Pvt. Road,<br />
                      Gevhande Apati, Lonavala,<br />
                      Maharashtra 412108
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-200" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Contact</p>
                    <p className="text-sm text-white">
                      +91 777 50 23535<br />
                      +91 976 78 55988
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-200" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-white break-all">
                      reservations@thearborealresort.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Important Notes Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 sm:p-5"
            >
              <h3 className="text-base sm:text-lg font-serif text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Important Information
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1 font-bold">•</span>
                  <span>Check-in: After 2:00 PM | Check-out: Before 11:00 AM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1 font-bold">•</span>
                  <span>Valid government ID required at check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1 font-bold">•</span>
                  <span>Early check-in/late check-out subject to availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1 font-bold">•</span>
                  <span>Confirmation email sent to registered email</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6"
        >
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-lg shadow-md hover:shadow-xl"
          >
            Print Confirmation
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider font-semibold rounded-lg shadow-md hover:shadow-xl"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;