import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [reservationNo, setReservationNo] = useState(null);

  const [formData, setFormData] = useState({
    // Guest Details
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",

    // Address
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",

    // Payment
    paymentMode: "Pay at Hotel",

    // Special Requests
    specialRequest: "",

    // Card Details (optional)
    cardNumber: "",
    cardType: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  useEffect(() => {
    if (!bookingData || !bookingData.room) {
      navigate("/");
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  const { room, searchData } = bookingData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const baseRate = parseFloat(
      room.room_rates_info?.avg_per_night_after_discount || 0
    );
    return (baseRate * nights).toFixed(2);
  };

  const calculateNights = () => {
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare booking data for ezeetechnosys API
    const bookingPayload = {
      Room_Details: {
        Room_1: {
          Rateplan_Id: room.Rateplan_Id || "",
          Ratetype_Id: room.Ratetype_Id || "",
          Roomtype_Id: room.Roomtype_Id || room.RoomType_Id || "",
          baserate:
            room.room_rates_info?.avg_per_night_after_discount?.toString() ||
            "0",
          extradultrate: room.extra_adult_rate?.toString() || "0",
          extrachildrate: room.extra_child_rate?.toString() || "0",
          number_adults: searchData.adults?.toString() || "2",
          number_children: searchData.children?.toString() || "0",
          ExtraChild_Age: searchData.children > 0 ? "5" : "0", // Default age, you might want to collect this
          Title: formData.title,
          First_Name: formData.firstName,
          Last_Name: formData.lastName,
          Gender: formData.gender,
          SpecialRequest: formData.specialRequest,
        },
      },
      check_in_date: searchData.checkIn,
      check_out_date: searchData.checkOut,
      Booking_Payment_Mode: formData.paymentMode,
      Email_Address: formData.email,
      MobileNo: formData.phone,
      Address: formData.address,
      State: formData.state,
      Country: formData.country,
      City: formData.city,
      Zipcode: formData.zipcode,
      Source_Id: "Website",
      Device: "Web",
      Languagekey: "en",
    };

    // Add card details if payment mode is card
    if (formData.paymentMode === "Credit Card" && formData.cardNumber) {
      bookingPayload.CardDetails = {
        cc_cardnumber: formData.cardNumber,
        cc_cardtype: formData.cardType,
        cc_expiremonth: formData.expiryMonth,
        cc_expireyear: formData.expiryYear,
        cvvcode: formData.cvv,
        cardholdername: formData.cardHolderName,
      };
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/booking/create`,
        bookingPayload
      );

      if (response.data.success) {
        setSuccess(true);
        setReservationNo(response.data.data.ReservationNo);

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Redirect to confirmation page after 3 seconds
        setTimeout(() => {
          navigate("/booking-confirmation", {
            state: {
              reservationNo: response.data.data.ReservationNo,
              bookingDetails: { ...bookingPayload, room, searchData },
            },
          });
        }, 3000);
      } else {
        setError(response.data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white p-12 shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your reservation has been successfully created.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Reservation Number</p>
            <p className="text-3xl font-serif text-gray-900">{reservationNo}</p>
          </div>
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to{" "}
            <strong>{formData.email}</strong>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ed] py-16 px-6 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 font-light">
            Just a few more details and you're all set!
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3"
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-white p-8 shadow-lg"
            >
              {/* Guest Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3">
                  <FiUser className="w-6 h-6" />
                  Guest Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Title
                    </label>
                    <select
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr.</option>
                      <option value="Mrs">Mrs.</option>
                      <option value="Ms">Ms.</option>
                      <option value="Dr">Dr.</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3">
                  <FiMapPin className="w-6 h-6" />
                  Address Details
                </h2>

                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Street address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="India"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                      Zipcode
                    </label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6 flex items-center gap-3">
                  <FiCreditCard className="w-6 h-6" />
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-gray-900 transition-all">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="Pay at Hotel"
                      checked={formData.paymentMode === "Pay at Hotel"}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="text-sm">Pay at Hotel</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-300 cursor-pointer hover:border-gray-900 transition-all">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="Credit Card"
                      checked={formData.paymentMode === "Credit Card"}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="text-sm">Credit Card</span>
                  </label>
                </div>

                {/* Card Details - Show only if Credit Card is selected */}
                {formData.paymentMode === "Credit Card" && (
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                        Card Holder Name
                      </label>
                      <input
                        type="text"
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                          Expiry Month
                        </label>
                        <input
                          type="text"
                          name="expiryMonth"
                          value={formData.expiryMonth}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                          placeholder="12"
                          maxLength="2"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                          Expiry Year
                        </label>
                        <input
                          type="text"
                          name="expiryYear"
                          value={formData.expiryYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                          placeholder="2025"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                          Card Type
                        </label>
                        <select
                          name="cardType"
                          value={formData.cardType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        >
                          <option value="">Select</option>
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Amex">American Express</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-gray-900 mb-6">
                  Special Requests
                </h2>
                <textarea
                  name="specialRequest"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm resize-none"
                  placeholder="Any special requirements or preferences..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 px-8 hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 text-sm uppercase tracking-wider shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Complete Booking"
                )}
              </button>
            </motion.form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 shadow-lg sticky top-24"
            >
              <h2 className="text-2xl font-serif text-gray-900 mb-6">
                Booking Summary
              </h2>

              {/* Room Image */}
              {room.room_main_image && (
                <img
                  src={room.room_main_image}
                  alt={room.Room_Name}
                  className="w-full h-48 object-cover mb-6 rounded-lg"
                />
              )}

              {/* Room Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-xl font-serif text-gray-900">
                  {room.Room_Name || room.Roomtype_Name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(searchData.checkIn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(searchData.checkOut)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nights:</span>
                    <span className="font-medium text-gray-900">
                      {calculateNights()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium text-gray-900">
                      {searchData.adults} Adult
                      {searchData.adults > 1 ? "s" : ""}
                      {searchData.children > 0 &&
                        `, ${searchData.children} Child${
                          searchData.children > 1 ? "ren" : ""
                        }`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {room.currency_sign}
                    {room.room_rates_info?.avg_per_night_after_discount?.toLocaleString()}{" "}
                    × {calculateNights()} night
                    {calculateNights() > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-gray-900">
                    {room.currency_sign}
                    {calculateTotalPrice()}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-900">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-serif text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-serif text-gray-900">
                    {room.currency_sign}
                    {calculateTotalPrice()}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                * Taxes and fees included
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
