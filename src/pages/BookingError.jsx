import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiXCircle,
  FiMail,
  FiPhone,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiHome,
  FiCreditCard,
  FiUser,
} from "react-icons/fi";

const BookingError = ({ location: locationProp }) => {
  const locationHook = useLocation();
  const navigate = useNavigate();
  
  // Support both hook (real usage) and prop (test preview)
  const location = locationProp || locationHook;

  const {
    errorType = "booking_failed",
    message = "Booking failed",
    paymentId,
    reservationNo,
    refundInitiated = false,
    guestInfo = {},
    bookingDetails = {},
  } = location.state || {};

  // If no error data, redirect to home (only for real usage, not test preview)
  if (!locationProp && !location.state) {
    navigate("/");
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const contactNumber = "97678 55988";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white pt-28 pb-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-xl p-4 sm:p-6 mb-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <FiXCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white">
                  Booking Failed
                </h1>
                <p className="text-red-50 text-xs sm:text-sm">{message}</p>
              </div>
            </div>
            {paymentId && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 sm:px-6 sm:py-3 text-center border border-white/30">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-red-50 mb-0.5">
                  Payment ID
                </p>
                <p className="text-sm sm:text-base font-mono text-white font-semibold break-all">
                  {paymentId.substring(0, 20)}...
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Error & Booking Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Refund Notice */}
            {refundInitiated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1">
                      Refund Initiated
                    </h3>
                    <p className="text-sm text-green-700">
                      Your payment has been automatically refunded. The refund will be processed to your original payment method within 5-7 business days.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error & Booking Details Cards Side by Side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Error Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Error Details
                </h2>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiAlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                        Error Type
                      </p>
                      <p className="text-sm sm:text-base text-gray-900 font-semibold capitalize">
                        {errorType.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {reservationNo && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiCreditCard className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                          Reservation No
                        </p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold">
                          {reservationNo}
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentId && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiCreditCard className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                          Payment ID
                        </p>
                        <p className="text-xs sm:text-sm font-mono text-gray-900 break-all">
                          {paymentId}
                        </p>
                      </div>
                    </div>
                  )}

                  {errorType === "unconfirmed_booking" && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs sm:text-sm text-yellow-800">
                        The booking was created but could not be confirmed due to inventory allocation issues. Your payment has been refunded.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Booking Details Card */}
              {bookingDetails && Object.keys(bookingDetails).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-xl shadow-md p-4 sm:p-6"
                >
                  <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                    Booking Details
                  </h2>

                  <div className="space-y-3">
                    {bookingDetails.checkIn && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiCalendar className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                            Check-in
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold">
                            {formatDate(bookingDetails.checkIn)}
                          </p>
                        </div>
                      </div>
                    )}

                    {bookingDetails.checkOut && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiCalendar className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                            Check-out
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold">
                            {formatDate(bookingDetails.checkOut)}
                          </p>
                        </div>
                      </div>
                    )}

                    {bookingDetails.rooms && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiHome className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                            Rooms
                          </p>
                          <p className="text-sm sm:text-base text-gray-900 font-semibold">
                            {bookingDetails.rooms}
                          </p>
                        </div>
                      </div>
                    )}

                    {bookingDetails.totalAmount && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg mt-3">
                        <span className="text-white font-medium text-sm sm:text-base">Total Amount</span>
                        <span className="text-white text-lg sm:text-xl font-bold">
                          {formatCurrency(bookingDetails.totalAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Guest Information Card */}
            {guestInfo && Object.keys(guestInfo).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Guest Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {guestInfo.name && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                          Name
                        </p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold truncate">
                          {guestInfo.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {guestInfo.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiMail className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                          Email
                        </p>
                        <p className="text-xs sm:text-sm text-gray-900 font-semibold break-all">
                          {guestInfo.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {guestInfo.phone && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiPhone className="w-5 h-5 text-gray-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                          Phone
                        </p>
                        <p className="text-sm sm:text-base text-gray-900 font-semibold">
                          {guestInfo.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-4">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-serif text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Need Help?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions or concerns about this booking or refund, please contact our reservation team:
              </p>
              <div className="space-y-3">
                <a
                  href={`tel:${contactNumber}`}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-blue-700">
                      {contactNumber}
                    </p>
                  </div>
                </a>
                <a
                  href="mailto:reservations@thearborealresort.com"
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
                      Email
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-700 break-all">
                      reservations@thearborealresort.com
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 space-y-3"
            >
              <button
                onClick={() => navigate("/")}
                className="w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <FiHome className="w-5 h-5" />
                Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingError;
