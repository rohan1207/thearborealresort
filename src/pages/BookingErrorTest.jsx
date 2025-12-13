import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiEye,
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiHome,
} from "react-icons/fi";
import BookingError from "./BookingError";

const BookingErrorTest = () => {
  const navigate = useNavigate();
  const [previewScenario, setPreviewScenario] = useState(null);

  // Sample data for different error scenarios
  // Note: All scenarios now show manual refund required (no auto-refund)
  const errorScenarios = [
    {
      id: "booking_failed_manual_refund",
      title: "Booking Creation Failed",
      description: "Payment succeeded but booking creation failed in eZee - Manual refund required",
      errorType: "booking_failed",
      message: "Booking creation failed: Room inventory not available",
      paymentId: "pay_test1234567890",
      reservationNo: null,
      refundInitiated: false, // No auto-refund, admin will handle
      requiresRefund: true,
      guestInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 9876543210",
      },
      bookingDetails: {
        checkIn: "2026-01-20",
        checkOut: "2026-01-21",
        rooms: 2,
        totalAmount: 25000,
      },
    },
    {
      id: "booking_confirmation_failed",
      title: "Booking Confirmation Failed",
      description: "Booking created but ProcessBooking confirmation failed - Manual refund required",
      errorType: "booking_failed",
      message: "Booking confirmation failed",
      paymentId: "pay_test3333333333",
      reservationNo: "1597",
      refundInitiated: false, // No auto-refund, admin will handle
      requiresRefund: true,
      guestInfo: {
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        phone: "+91 9876543214",
      },
      bookingDetails: {
        checkIn: "2026-02-15",
        checkOut: "2026-02-17",
        rooms: 1,
        totalAmount: 18000,
      },
    },
    {
      id: "payment_verification_failed",
      title: "Payment Verification Failed",
      description: "Payment signature verification failed - No refund needed",
      errorType: "payment_error",
      message: "Payment verification failed - Invalid signature",
      paymentId: "pay_test1111111111",
      reservationNo: null,
      refundInitiated: false,
      requiresRefund: false, // Payment not verified, so no refund needed
      guestInfo: {
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        phone: "+91 9876543212",
      },
      bookingDetails: {
        checkIn: "2026-02-01",
        checkOut: "2026-02-03",
        rooms: 3,
        totalAmount: 45000,
      },
    },
    {
      id: "system_error_manual_refund",
      title: "System Error",
      description: "System error during booking process - Manual refund required",
      errorType: "system_error",
      message: "System error during booking process",
      paymentId: "pay_test2222222222",
      reservationNo: null,
      refundInitiated: false, // No auto-refund, admin will handle
      requiresRefund: true,
      guestInfo: {
        name: "Alice Brown",
        email: "alice.brown@example.com",
        phone: "+91 9876543213",
      },
      bookingDetails: {
        checkIn: "2026-02-10",
        checkOut: "2026-02-12",
        rooms: 2,
        totalAmount: 30000,
      },
    },
    {
      id: "invalid_booking_data",
      title: "Invalid Booking Data",
      description: "Payment succeeded but booking data is invalid - Manual refund required",
      errorType: "booking_failed",
      message: "Invalid booking data provided",
      paymentId: "pay_test4444444444",
      reservationNo: null,
      refundInitiated: false, // No auto-refund, admin will handle
      requiresRefund: true,
      guestInfo: {
        name: "David Lee",
        email: "david.lee@example.com",
        phone: "+91 9876543215",
      },
      bookingDetails: {
        checkIn: "2026-03-01",
        checkOut: "2026-03-03",
        rooms: 1,
        totalAmount: 20000,
      },
    },
  ];

  const handlePreview = (scenario) => {
    setPreviewScenario(scenario);
  };

  const handleTestNavigation = (scenario) => {
    navigate("/booking-error", {
      state: scenario,
    });
  };

  if (previewScenario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Preview: {previewScenario.title}</h2>
            <button
              onClick={() => setPreviewScenario(null)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Test Page
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <BookingError location={{ state: previewScenario }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Error Page Test Suite
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Preview all error scenarios to test the UI and see how different
            error cases are displayed to users.
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a test page for development
              purposes only. Use this to preview error pages without triggering
              real errors.
            </p>
          </div>
        </motion.div>

        {/* Error Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div
                className={`px-6 py-4 ${
                  scenario.requiresRefund
                    ? "bg-orange-600"
                    : "bg-red-600"
                } text-white`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{scenario.title}</h3>
                  {scenario.requiresRefund ? (
                    <FiAlertCircle className="w-5 h-5" />
                  ) : (
                    <FiXCircle className="w-5 h-5" />
                  )}
                </div>
                <p className="text-sm text-white/90">{scenario.description}</p>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Error Type:</span>
                    <span className="font-semibold capitalize">
                      {scenario.errorType.replace("_", " ")}
                    </span>
                  </div>
                  {scenario.requiresRefund && (
                    <div className="flex items-center text-sm text-orange-600">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      <span>Manual Refund Required</span>
                    </div>
                  )}
                  {!scenario.requiresRefund && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span>No Refund Needed</span>
                    </div>
                  )}
                  {scenario.reservationNo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reservation No:</span>
                      <span className="font-semibold">
                        {scenario.reservationNo}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-xs">
                      {scenario.paymentId.substring(0, 12)}...
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handlePreview(scenario)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleTestNavigation(scenario)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    Navigate
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiAlertCircle className="w-5 h-5 mr-2 text-blue-600" />
            How to Use This Test Page
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <p>
                <strong>Preview:</strong> Click "Preview" to see the error page
                in a modal/overlay without navigating away.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <p>
                <strong>Navigate:</strong> Click "Navigate" to actually navigate
                to the error page (useful for testing browser back button,
                etc.).
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <p>
                <strong>Test Scenarios:</strong> Each card represents a
                different error scenario that can occur in the booking flow.
              </p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <p>
                <strong>Real Testing:</strong> To test with real errors, you
                can temporarily modify the backend to force these error
                conditions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center mx-auto"
          >
            <FiHome className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingErrorTest;

