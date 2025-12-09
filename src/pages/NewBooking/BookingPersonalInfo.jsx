import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BookingPersonalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, searchData, bookingDetails } = location.state || {};

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    zipcode: "",
    specialRequest: "",
  });

  const [errors, setErrors] = useState({});

  const titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  const genders = ["Male", "Female", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.zipcode) newErrors.zipcode = "Zipcode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Navigate to extras page
    navigate("/booking/extras", {
      state: {
        room,
        searchData,
        bookingDetails,
        personalInfo: formData,
      },
    });
  };

  if (!room || !searchData || !bookingDetails) {
    navigate("/availability");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500">
                Select Date
              </span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900 hidden sm:inline">
                Personal Information
              </span>
              <span className="ml-1 text-xs font-medium text-gray-900 sm:hidden">
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
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Let Us Know Who You Are
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Guest Details Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                    Guest Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {/* Title */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Title</option>
                        {titles.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                      {errors.title && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                      >
                        <option value="">Select Gender</option>
                        {genders.map((gender) => (
                          <option key={gender} value={gender}>
                            {gender}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                    Address
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {/* Address */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* City */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                            errors.city ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter city"
                        />
                        {errors.city && (
                          <p className="mt-1 text-xs sm:text-sm text-red-500">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Enter state"
                        />
                        {errors.state && (
                          <p className="mt-1 text-xs sm:text-sm text-red-500">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                            errors.country
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter country"
                        />
                        {errors.country && (
                          <p className="mt-1 text-xs sm:text-sm text-red-500">
                            {errors.country}
                          </p>
                        )}
                      </div>

                      {/* Zipcode */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Zipcode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="zipcode"
                          value={formData.zipcode}
                          onChange={handleChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base ${
                            errors.zipcode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter zipcode"
                          maxLength="6"
                        />
                        {errors.zipcode && (
                          <p className="mt-1 text-xs sm:text-sm text-red-500">
                            {errors.zipcode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Any special requirements or requests?"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-3 sm:pt-4 gap-3 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm sm:text-base order-1 sm:order-2"
                  >
                    Continue to Extras
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-xl font-serif font-bold mb-4">
                Room Summary
              </h3>

              {/* Room Details */}
              <div className="mb-4">
                <h4 className="font-semibold text-lg">{room.Room_Name}</h4>
                <p className="text-gray-600 text-sm">{room.Roomtype_Name}</p>
              </div>

              {/* Booking Details */}
              <div className="space-y-3 py-4 border-t border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-semibold">
                    {new Date(bookingDetails.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-semibold">
                    {new Date(bookingDetails.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-semibold">{bookingDetails.nights}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-semibold">
                    {searchData.adults} Adults, {searchData.children || 0}{" "}
                    Children
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-amber-600">
                    {room.currency_sign}
                    {bookingDetails.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPersonalInfo;