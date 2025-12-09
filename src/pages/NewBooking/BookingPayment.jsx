import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const BookingPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { room, searchData, bookingDetails, personalInfo, selectedExtras } =
    location.state || {};

  const [paymentGateways, setPaymentGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!room || !searchData || !bookingDetails || !personalInfo) {
      navigate("/availability");
      return;
    }

    console.log("=== BookingPayment Page Loaded ===");
    console.log("Room:", room);
    console.log("Search Data:", searchData);
    console.log("Booking Details:", bookingDetails);
    console.log("Personal Info:", personalInfo);
    console.log("Selected Extras:", selectedExtras);

    fetchPaymentGateways();
  }, []);

  const fetchPaymentGateways = async () => {
    try {
      console.log("=== Fetching Payment Gateways ===");
      const response = await axios.get(
        `${API_BASE_URL}/api/booking/payment-gateways`
      );
      console.log("Payment Gateways Response:", response.data);

      if (response.data.success && response.data.data.length > 0) {
        setPaymentGateways(response.data.data);
        console.log(`Found ${response.data.data.length} Razorpay gateway(s)`);
        // Auto-select first Razorpay gateway
        setSelectedGateway(response.data.data[0].paymenttypeunkid);
      } else {
        console.log("No Razorpay gateways configured");
        setPaymentGateways([]);
      }
    } catch (error) {
      console.error("Error fetching payment gateways:", error);
      setPaymentGateways([]);
    }
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openRazorpayPopup = async (reservationNo, totalAmount) => {
    try {
      console.log("\n=== STEP 2: Opening Razorpay Popup ===");
      
      // Create Razorpay order
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/booking/razorpay/create-order`,
        {
          amount: totalAmount,
          currency: room.currency_code || "INR",
          receipt: `receipt_${reservationNo}`,
          notes: {
            reservationNo,
            email: personalInfo.email,
            phone: personalInfo.phone,
            name: `${personalInfo.firstName} ${personalInfo.lastName}`
          }
        }
      );

      if (!orderResponse.data.success) {
        throw new Error("Failed to create Razorpay order");
      }

      const { orderId, amount, currency, key } = orderResponse.data;
      
      console.log("Razorpay Order Created:", { orderId, amount, currency });

      // Configure Razorpay options
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "The Arboreal Resort",
        description: `Booking Payment - ${reservationNo}`,
        order_id: orderId,
        prefill: {
          name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          email: personalInfo.email,
          contact: personalInfo.phone
        },
        theme: {
          color: "#D97706" // Amber color matching your theme
        },
        handler: async function (response) {
          console.log("\n=== Payment Successful ===");
          console.log("Payment Response:", response);
          
          try {
            // Verify payment and confirm booking with eZee
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/api/booking/razorpay/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                reservationNo: reservationNo
              }
            );

            if (verifyResponse.data.success && verifyResponse.data.ezeeConfirmed) {
              console.log("✅ Payment verified and booking confirmed in eZee!");
              
              // Navigate to success page
              navigate("/booking-confirmation", {
                state: {
                  reservationNo: reservationNo,
                  paymentMode: "Online - Razorpay",
                  paymentId: response.razorpay_payment_id,
                  bookingConfirmed: true,
                  bookingDetails: {
                    room,
                    searchData,
                    personalInfo,
                    totalAmount,
                    email: personalInfo.email,
                    phone: personalInfo.phone
                  }
                }
              });
            } else {
              throw new Error(verifyResponse.data.message || "Booking confirmation failed");
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert("Payment was successful but booking confirmation failed. Please contact support with your payment ID: " + response.razorpay_payment_id);
          }
        },
        modal: {
          ondismiss: function() {
            console.log("Payment popup closed by user");
            setProcessing(false);
            alert("Payment cancelled. Your booking (Reservation No: " + reservationNo + ") is pending payment confirmation.");
          }
        }
      };

      // Open Razorpay popup
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Error opening Razorpay popup:", error);
      setProcessing(false);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const handleSubmitBooking = async () => {
    setProcessing(true);

    try {
      // STEP 1: Create booking with eZee API
      const bookingPayload = await prepareBookingPayload();

      console.log("STEP 1: Creating booking with eZee API...");
      console.log("Booking Payload:", JSON.stringify(bookingPayload, null, 2));

      const bookingResponse = await axios.post(
        `${API_BASE_URL}/api/booking/create`,
        bookingPayload
      );

      if (!bookingResponse.data.success) {
        throw new Error(
          bookingResponse.data.message || "Booking creation failed"
        );
      }

      const { ReservationNo } = bookingResponse.data.data;
      console.log(
        "✅ Booking created successfully! ReservationNo:",
        ReservationNo
      );

      // Calculate total amount
      const totalAmount =
        bookingDetails.totalPrice + (bookingDetails.extrasCharge || 0);

      // STEP 2: Open Razorpay payment popup (automatically opens after booking creation)
      await openRazorpayPopup(ReservationNo, totalAmount);

    } catch (error) {
      console.error("Booking error:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Booking failed. Please try again.";

      if (
        error.response?.data?.error &&
        Array.isArray(error.response.data.error)
      ) {
        const errorObj = error.response.data.error[0];
        console.log("=== EZEE ERROR DETAILS ===");
        console.log("Full error object:", JSON.stringify(errorObj, null, 2));
        
        errorMessage =
          errorObj?.["Error Details"]?.Error_Message ||
          errorObj?.Error_Message ||
          errorObj?.error ||
          JSON.stringify(errorObj);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Booking Failed\n\n${errorMessage}`);
      setProcessing(false);
    }
  };

  // Helper function to prepare booking payload
  const prepareBookingPayload = () => {
    console.log("=== Preparing Booking Payload ===");
    console.log("Room data:", room);
    console.log("Personal Info:", personalInfo);
    console.log("Search Data:", searchData);
    console.log("Booking Details:", bookingDetails);
    
    // Log the critical IDs
    console.log("=== CRITICAL IDS FROM ROOM OBJECT ===");
    console.log("Package_Id (will be used for Rateplan_Id):", room.Package_Id);
    console.log("roomrateunkid:", room.roomrateunkid);
    console.log("ratetypeunkid (Ratetype_Id):", room.ratetypeunkid);
    console.log("roomtypeunkid (Roomtype_Id):", room.roomtypeunkid);
    console.log("rack_rate (baserate):", room.room_rates_info?.rack_rate);
    console.log("extra_adult rack_rate:", room.extra_adult_rates_info?.rack_rate);
    console.log("extra_child rack_rate:", room.extra_child_rates_info?.rack_rate);
    console.log("\n=== RATE INFO STRUCTURE ===");
    console.log("room_rates_info.exclusive_tax:", room.room_rates_info?.exclusive_tax);
    console.log("extra_adult_rates_info.exclusive_tax:", room.extra_adult_rates_info?.exclusive_tax);
    console.log("extra_child_rates_info.exclusive_tax:", room.extra_child_rates_info?.exclusive_tax);

    // Validate required fields
    if (!personalInfo?.email) {
      throw new Error("Email address is required");
    }
    if (!personalInfo?.firstName) {
      throw new Error("First name is required");
    }
    if (!personalInfo?.lastName) {
      throw new Error("Last name is required");
    }
    if (!bookingDetails?.checkIn) {
      throw new Error("Check-in date is required");
    }
    if (!bookingDetails?.checkOut) {
      throw new Error("Check-out date is required");
    }

    // CRITICAL: Validate check-in date is not in the past
    // eZee API rejects bookings for past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    // Parse check-in date and reset time to start of day for accurate comparison
    const checkInDate = new Date(bookingDetails.checkIn);
    checkInDate.setHours(0, 0, 0, 0);
    
    // Only validate against past dates, allow today and future dates
    if (checkInDate < today) {
      const todayStr = today.toISOString().split('T')[0];
      throw new Error(
        `Check-in date must be today (${todayStr}) or a future date. eZee API does not accept bookings for past dates.`
      );
    }

    // Get base rate - Use the ACTUAL SELLING PRICE from exclusive_tax
    // eZee InsertBooking API expects the per-night rate from the room search
    // Use the first date's exclusive_tax value (the actual per-night selling price)
    const firstDateExclusiveTax = Object.values(room.room_rates_info?.exclusive_tax || {})[0];
    const baseRate = String(
      Math.round(parseFloat(firstDateExclusiveTax ?? "0"))
    );
    
    // For extra adult/child, use the exclusive_tax rate (actual per-night charge)
    const firstDateExtraAdultTax = Object.values(room.extra_adult_rates_info?.exclusive_tax || {})[0];
    const extraAdultRate = String(
      Math.round(parseFloat(firstDateExtraAdultTax ?? "0"))
    );
    
    const firstDateExtraChildTax = Object.values(room.extra_child_rates_info?.exclusive_tax || {})[0];
    const extraChildRate = String(
      Math.round(parseFloat(firstDateExtraChildTax ?? "0"))
    );

    const roomDetails = {
      // All ID fields must be strings from room object
      Rateplan_Id: String(room.roomrateunkid || ""),
      Ratetype_Id: String(room.ratetypeunkid || ""),
      Roomtype_Id: String(room.roomtypeunkid || ""),
      // Rates as simple string numbers (matching Postman example format)
      baserate: baseRate,
      extradultrate: extraAdultRate,
      extrachildrate: extraChildRate,
      // Number of adults and children as strings
      number_adults: String(searchData.adults),
      number_children: String(searchData.children || 0),
      // Guest details - Following EXACT Postman example format
      // Postman uses empty strings for Title and Gender!
      Title: "",  // Empty string as per Postman example
      First_Name: String(personalInfo.firstName || ""),
      Last_Name: String(personalInfo.lastName || ""),
      Gender: "",  // Empty string as per Postman example
      SpecialRequest: "",  // Empty string as per Postman example
    };

    // CRITICAL: ExtraChild_Age is MANDATORY if number_children > 0
    // API expects a SINGLE age value (like "5"), NOT comma-separated values
    if (searchData.children > 0) {
      // Use default age "5" for all children
      roomDetails.ExtraChild_Age = "5";
    }
    
    // Log the constructed room details
    console.log("=== CONSTRUCTED ROOM DETAILS ===");
    console.log(JSON.stringify(roomDetails, null, 2));

    // Build booking payload - EXACTLY matching Postman collection example
    const bookingPayload = {
      Room_Details: {
        Room_1: roomDetails,
      },
      check_in_date: bookingDetails.checkIn,  // Format: YYYY-MM-DD
      check_out_date: bookingDetails.checkOut,  // Format: YYYY-MM-DD
      Booking_Payment_Mode: "",  // Empty string as per Postman example
      Email_Address: personalInfo.email,
      Source_Id: "",  // Empty string as per Postman example
      MobileNo: "",  // Empty string as per Postman example
      Address: "",  // Empty string as per Postman example
      State: "",  // Empty string as per Postman example
      Country: "",  // Empty string as per Postman example
      City: "",  // Empty string as per Postman example
      Zipcode: "",  // Empty string as per Postman example
      Fax: "",  // Empty string as per Postman example
      Device: "",  // Empty string as per Postman example
      Languagekey: "",  // Empty string as per Postman example
      paymenttypeunkid: ""  // Empty string as per Postman example
    };

    // Add extras if valid
    // NOTE: Temporarily disabled to test if this is causing the ParametersMissing error
    // const hasValidExtras =
    //   selectedExtras &&
    //   Object.keys(selectedExtras).length > 0 &&
    //   bookingDetails.extrasCharge > 0;

    // if (hasValidExtras) {
    //   bookingPayload.ExtraCharge = selectedExtras;
    // }

    console.log(
      "Extras disabled for testing. Selected extras:",
      selectedExtras
    );

    console.log(
      "Final booking payload:",
      JSON.stringify(bookingPayload, null, 2)
    );
    return bookingPayload;
  };

  if (!room || !searchData || !bookingDetails || !personalInfo) {
    return null;
  }

  const totalAmount =
    bookingDetails.totalPrice + (bookingDetails.extrasCharge || 0);

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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                ✓
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-500 hidden sm:inline">
                Personal Info
              </span>
              <span className="ml-1 text-xs font-medium text-gray-500 sm:hidden">
                Info
              </span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm sm:text-base">
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-gray-900">
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Payment Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                Payment Details
              </h2>

              {/* Payment Gateway Information */}
              {paymentGateways.length > 0 ? (
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                    <h3 className="text-base sm:text-lg font-semibold">
                      Secure Payment via Razorpay
                    </h3>
                    <span className="px-2.5 sm:px-3 py-1 bg-green-100 text-green-800 text-[10px] sm:text-xs font-semibold rounded-full">
                      ✓ Secure
                    </span>
                  </div>
                  
                  {/* Selected Gateway Display */}
                  {paymentGateways.map((gateway) => (
                    gateway.paymenttypeunkid === selectedGateway && (
                      <div
                        key={gateway.paymenttypeunkid}
                        className="p-4 sm:p-6 border-2 border-amber-600 bg-amber-50 rounded-lg"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                          <div>
                            <p className="font-semibold text-base sm:text-lg">{gateway.paymenttype}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                              Click "Proceed to Payment" to complete your booking securely
                            </p>
                          </div>
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    )
                  ))}

                  {/* Payment Info */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Payment Process
                    </h4>
                    <ul className="text-xs sm:text-sm text-blue-800 space-y-1 ml-6 sm:ml-7">
                      <li>• Your booking will be created with a reservation number</li>
                      <li>• Razorpay payment popup will open automatically</li>
                      <li>• Choose your payment method (UPI, Cards, NetBanking, etc.)</li>
                      <li>• On successful payment, booking is instantly confirmed</li>
                      <li>• You'll receive confirmation via email immediately</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-yellow-900 mb-2">
                    Payment Gateway Not Configured
                  </h3>
                  <p className="text-xs sm:text-sm text-yellow-800">
                    Online payment is currently unavailable. Please contact the resort directly to complete your booking.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t gap-3 sm:gap-0">
                <button
                  onClick={() => navigate(-1)}
                  disabled={processing}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={processing || paymentGateways.length === 0}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Proceed to Payment</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 sticky top-8"
            >
              <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4">
                Final Summary
              </h3>

              {/* Room Details */}
              <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <h4 className="font-semibold text-sm sm:text-base">{room.Room_Name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {bookingDetails.nights} nights
                </p>
              </div>

              {/* Guest Info */}
              <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Guest:</p>
                <p className="font-semibold text-xs sm:text-sm">
                  {personalInfo.title} {personalInfo.firstName}{" "}
                  {personalInfo.lastName}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Room Rate</span>
                  <span className="font-semibold">
                    {room.currency_sign}
                    {bookingDetails.totalPrice.toFixed(2)}
                  </span>
                </div>

                {bookingDetails.extrasCharge > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Extra Services</span>
                    <span className="font-semibold">
                      {room.currency_sign}
                      {bookingDetails.extrasCharge.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-3 sm:pt-4 border-t">
                <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                  <span>Total to Pay</span>
                  <span className="text-amber-600">
                    {room.currency_sign}
                    {totalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                  Payment: Secure Online Payment
                </p>
              </div>

              {/* Important Notes */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <p className="text-[10px] sm:text-xs text-gray-600">
                  <strong>Note:</strong> Check-in time is after{" "}
                  {room.check_in_time || "2:00 PM"} and check-out time is before{" "}
                  {room.check_out_time || "12:00 PM"}.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPayment;