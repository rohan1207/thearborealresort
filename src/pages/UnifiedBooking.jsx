import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiUsers,
  FiMaximize,
  FiWifi,
  FiCoffee,
  FiSun,
  FiDroplet,
  FiGrid,
  FiAirplay,
  FiX,
} from "react-icons/fi";
import { ROOMS, findRoomByName } from "../Data/rooms";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const UnifiedBooking = () => {
  const navigate = useNavigate();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Calendar, 2: Select Room, 3: Personal Info, 4: Payment
  
  // Step 1: Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [rooms, setRooms] = useState(1); // Will be calculated automatically based on adults/children
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  
  // Step 2: Room selection state
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [expandedRates, setExpandedRates] = useState(null); // roomrateunkid of expanded rates card
  const [expandedDetails, setExpandedDetails] = useState(null); // roomrateunkid of expanded details card
  const [showBookingConditions, setShowBookingConditions] = useState(false);
  
  // Step 3: Personal Info state
  const [personalInfo, setPersonalInfo] = useState({
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
  const [personalInfoErrors, setPersonalInfoErrors] = useState({});
  
  // Step 4: Payment state
  const [bookingDetails, setBookingDetails] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({});
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Default amenities
  const defaultAmenities = [
    { icon: <FiWifi />, name: "Wi-Fi" },
    { icon: <FiSun />, name: "AC" },
    { icon: <FiDroplet />, name: "Bath" },
    { icon: <FiCoffee />, name: "Coffee" },
    { icon: <FiGrid />, name: "Balcony" },
    { icon: <FiAirplay />, name: "TV" },
  ];

  // Pricing configuration (business rules)
  const DISCOUNT_RATE = 0.20; // 20% discount applied to base rate
  const GST_RATE_LOW = 0.05; // 5% GST for base rate < 7500
  const GST_RATE_HIGH = 0.18; // 18% GST for base rate >= 7500 (split as 9% SGST + 9% CGST)
  const GST_THRESHOLD = 7500; // Threshold for GST rate selection
  const SGST_RATE = 0.09; // 9% SGST (State GST)
  const CGST_RATE = 0.09; // 9% CGST (Central GST)
  // Note: eZee calculates GST as 9% SGST + 9% CGST (not 18% directly)
  // We calculate what eZee will show (discounted base + eZee GST) to display to user
  // But we only send discounted base rate to eZee, letting them handle GST

  const sanitizeRoomName = (value = "") =>
    value
      .replace(/limited period\s*-\s*/i, "")
      .replace(/\s*-\s*(cp|map|ep)\s*$/i, "")
      .replace(/\s*-\s*plan.*$/i, "")
      .trim();

  const slugifyRoomName = (value = "") =>
    sanitizeRoomName(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Occupancy validation based on room type and max occupancy rules
  // numRooms: number of rooms being requested (defaults to 1)
  const validateOccupancy = (room, requestedAdults, requestedChildren, numRooms = 1) => {
    const roomName = sanitizeRoomName(room.Room_Name || room.Roomtype_Name || "");
    const maxAdults = parseInt(room.max_adult_occupancy || "0", 10);
    const maxChildren = parseInt(room.max_child_occupancy || "0", 10);
    
    // For multiple rooms, scale the max occupancy
    const totalMaxAdults = maxAdults * numRooms;
    const totalMaxChildren = maxChildren * numRooms;
    
    // Check if requested exceeds total max occupancy
    if (requestedAdults > totalMaxAdults || requestedChildren > totalMaxChildren) {
      return false;
    }
    
    // For single room, apply special rules
    if (numRooms === 1) {
      // Special rules based on room type
      if (roomName.toLowerCase().includes("classic sunroom")) {
        // Max: 2 Adults/1 Child
        if (requestedAdults > 2 || requestedChildren > 1) return false;
        if (requestedAdults === 2 && requestedChildren === 1) return true;
        if (requestedAdults <= 2 && requestedChildren <= 1) return true;
        return false;
      }
      
      if (roomName.toLowerCase().includes("forest bathtub") || 
          roomName.toLowerCase().includes("luxury sunroom")) {
        // Max: 3 Adults/2 Children, but NOT 3 Adults/2 Children together
        if (requestedAdults > 3 || requestedChildren > 2) return false;
        if (requestedAdults === 3 && requestedChildren === 2) return false; // Not allowed
        if (requestedAdults <= 3 && requestedChildren <= 2) return true;
        return false;
      }
      
      if (roomName.toLowerCase().includes("forest private pool")) {
        // Max: 3 Adults/1 Child, but NOT 3 Adults/1 Child together
        if (requestedAdults > 3 || requestedChildren > 1) return false;
        if (requestedAdults === 3 && requestedChildren === 1) return false; // Not allowed
        if (requestedAdults <= 3 && requestedChildren <= 1) return true;
        return false;
      }
    } else {
      // For multiple rooms, we need to check if the combination can be distributed
      // For 2+ rooms, the special disallowed combinations don't apply the same way
      // because we can distribute guests across multiple rooms
      
      // Check if total fits within scaled max occupancy
      const totalPeople = requestedAdults + requestedChildren;
      const maxPeoplePerRoom = roomName.toLowerCase().includes("classic sunroom") ? 3 : 4;
      const totalMaxPeople = maxPeoplePerRoom * numRooms;
      
      if (totalPeople > totalMaxPeople) {
        return false;
      }
      
      // Additional validation: ensure we can distribute guests
      // For now, if it fits in total max, we allow it
      // The actual distribution will be handled by eZee
      return true;
    }
    
    // Default: check against max occupancy
    return requestedAdults <= totalMaxAdults && requestedChildren <= totalMaxChildren;
  };

  // Calculate minimum rooms needed based on adults and children
  // This uses the occupancy rules: base and max occupancy per room type
  const calculateMinimumRooms = (requestedAdults, requestedChildren) => {
    // Room type configurations (per room)
    const roomConfigs = {
      "classic sunroom": {
        baseAdults: 2,
        baseChildren: 0,
        maxAdults: 2,
        maxChildren: 1,
        maxPeople: 3
      },
      "forest bathtub": {
        baseAdults: 2,
        baseChildren: 0,
        maxAdults: 3,
        maxChildren: 2,
        maxPeople: 4,
        // Special rule: 3A/2C not allowed
        disallowed: [{ adults: 3, children: 2 }]
      },
      "luxury sunroom": {
        baseAdults: 2,
        baseChildren: 0,
        maxAdults: 3,
        maxChildren: 2,
        maxPeople: 4,
        // Special rule: 3A/2C not allowed
        disallowed: [{ adults: 3, children: 2 }]
      },
      "forest private pool": {
        baseAdults: 2,
        baseChildren: 0,
        maxAdults: 3,
        maxChildren: 1,
        maxPeople: 3,
        // Special rule: 3A/1C not allowed
        disallowed: [{ adults: 3, children: 1 }]
      }
    };

    // Check if it fits in 1 room
    for (const [roomType, config] of Object.entries(roomConfigs)) {
      // Check if disallowed combination
      const isDisallowed = config.disallowed?.some(
        rule => rule.adults === requestedAdults && rule.children === requestedChildren
      );
      if (isDisallowed) continue;

      // Check if fits in max occupancy
      if (requestedAdults <= config.maxAdults && requestedChildren <= config.maxChildren) {
        const totalPeople = requestedAdults + requestedChildren;
        if (totalPeople <= config.maxPeople) {
          return 1; // Can fit in 1 room
        }
      }
    }

    // If doesn't fit in 1 room, calculate for multiple rooms
    // For 2+ rooms, base and max occupancy scale with number of rooms
    // Example: 2 rooms = 4A/0C base, 6A/4C max, 8 people max
    for (let numRooms = 2; numRooms <= 4; numRooms++) {
      const totalBaseAdults = numRooms * 2; // 2 adults base per room
      const totalBaseChildren = numRooms * 0; // 0 children base per room
      const totalMaxAdults = numRooms * 3; // Max 3 adults per room
      const totalMaxChildren = numRooms * 2; // Max 2 children per room
      const totalMaxPeople = numRooms * 4; // Max 4 people per room

      // Check if requested fits within max limits
      if (requestedAdults <= totalMaxAdults && 
          requestedChildren <= totalMaxChildren) {
        const totalPeople = requestedAdults + requestedChildren;
        if (totalPeople <= totalMaxPeople) {
          // Additional check: for multiple rooms, we need to ensure the combination
          // can be distributed across rooms without violating per-room rules
          // For now, we'll use a simple check - if it fits in max, it should work
          // The actual room filtering will happen based on eZee's available rooms
          return numRooms;
        }
      }
    }

    return 4; // Maximum allowed (fallback)
  };

  // Calendar helpers
  const normalize = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

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

  // Helper function to format date as YYYY-MM-DD in local timezone (not UTC)
  const formatDateForAPI = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return date >= selectedCheckIn && date <= selectedCheckOut;
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);

    if (!isDateAvailable(clickedDate)) return;

    // If no check-in is selected, set it as check-in
    if (!selectedCheckIn) {
      setSelectedCheckIn(clickedDate);
      setSelectedCheckOut(null);
      setSelectingCheckOut(true);
      return;
    }

    // If check-in is selected but no check-out
    if (selectedCheckIn && !selectedCheckOut) {
      // If clicked date is before check-in, make it the new check-in
      if (clickedDate < selectedCheckIn) {
        setSelectedCheckIn(clickedDate);
        setSelectedCheckOut(null);
      } else {
        // Otherwise, set it as check-out
        setSelectedCheckOut(clickedDate);
        setSelectingCheckOut(false);
      }
      return;
    }

    // If both dates are selected, start a new selection
    if (selectedCheckIn && selectedCheckOut) {
      if (clickedDate < selectedCheckIn) {
        setSelectedCheckIn(clickedDate);
        setSelectedCheckOut(null);
        setSelectingCheckOut(true);
      } else {
        setSelectedCheckIn(clickedDate);
        setSelectedCheckOut(null);
        setSelectingCheckOut(true);
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    const today = new Date();
    const prevMonthDate = new Date(year, month - 1, 1);
    if (prevMonthDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(prevMonthDate);
    }
  };

  // Step 1: Check Availability
  const handleCheckAvailability = async () => {
    // Validate dates
    if (!selectedCheckIn || !selectedCheckOut) {
      Swal.fire({
        icon: "error",
        title: "Missing Dates",
        text: "Please select check-in and check-out dates",
        confirmButtonColor: "#000000",
      });
      return;
    }

    // Validate name
    if (!guestName || guestName.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Name",
        text: "Please enter your full name",
        confirmButtonColor: "#000000",
      });
      return;
    }

    // Validate phone
    if (!guestPhone || guestPhone.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Phone Number",
        text: "Please enter your phone number",
        confirmButtonColor: "#000000",
      });
      return;
    }

    // Validate phone format (10 digits)
    if (!/^\d{10}$/.test(guestPhone.trim())) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10-digit phone number",
        confirmButtonColor: "#000000",
      });
      return;
    }

    // Validate adults and children
    if (!adults || parseInt(adults) < 1) {
      Swal.fire({
        icon: "error",
        title: "Invalid Guests",
        text: "Please select at least 1 adult",
        confirmButtonColor: "#000000",
      });
      return;
    }

    // Calculate minimum rooms needed based on adults and children
    const requestedAdults = parseInt(adults);
    const requestedChildren = parseInt(children || 0);
    const minRoomsNeeded = calculateMinimumRooms(requestedAdults, requestedChildren);

    setSearchLoading(true);

    try {
      const checkInStr = formatDateForAPI(selectedCheckIn);
      const checkOutStr = formatDateForAPI(selectedCheckOut);
      
      // Call eZee API for availability with calculated minimum rooms
      const response = await axios.post(`${API_BASE_URL}/api/booking/search`, {
        checkIn: checkInStr,
        checkOut: checkOutStr,
        rooms: minRoomsNeeded, // Use calculated minimum rooms
        adults: requestedAdults,
        children: requestedChildren,
      });

      // Check if there's an error in the response
      if (response.data.Errors) {
        throw new Error(response.data.Errors.ErrorMessage || 'Failed to fetch rooms. Please try again.');
      }
      
      const roomData = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Filter rooms based on:
      // 1. Occupancy rules (validateOccupancy) - with number of rooms
      // 2. Available rooms count from eZee
      // Optimized: Pre-compute values outside filter loop
      const filteredRooms = roomData.filter((room) => {
        // Check occupancy rules with number of rooms
        if (!validateOccupancy(room, requestedAdults, requestedChildren, minRoomsNeeded)) {
          return false;
        }

        // Check available rooms from eZee
        const availableRoomsData = room.available_rooms || {};
        const minAvailableRooms = parseInt(room.min_ava_rooms || "0", 10);
        
        // Check if we have enough available rooms for the minimum rooms needed
        if (minAvailableRooms < minRoomsNeeded) {
          return false;
        }

        // Also check per-date availability if available_rooms has date-specific data
        if (availableRoomsData[checkInStr]) {
          const availableForDate = parseInt(availableRoomsData[checkInStr] || "0", 10);
          if (availableForDate < minRoomsNeeded) {
            return false;
          }
        }

        return true;
      });

      // Set state immediately - don't wait for anything
      setAvailableRooms(filteredRooms);
      setSearchData({
        checkIn: checkInStr,
        checkOut: checkOutStr,
        rooms: minRoomsNeeded, // Store calculated rooms
        adults: requestedAdults,
        children: requestedChildren,
      });
      
      // Move to next step immediately - don't block on inquiry save
      if (filteredRooms.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Rooms Available",
          text: `No rooms available for ${requestedAdults} adults and ${requestedChildren} children. Please adjust your selection.`,
          confirmButtonColor: "#000000",
        });
      } else {
        setCurrentStep(2); // Move to room selection immediately
      }
      
      // Save inquiry to database (truly non-blocking - fire and forget)
      // This runs in background and doesn't affect user flow
      if (guestName && guestPhone) {
        axios.post(`${API_BASE_URL}/api/inquiries`, {
          name: guestName,
          phone: guestPhone,
          email: "", // Email is collected later in personal info step
          checkIn: checkInStr,
          checkOut: checkOutStr,
          rooms: minRoomsNeeded,
          adults: requestedAdults,
          children: requestedChildren,
        }).catch((inquiryError) => {
          // Silently fail - don't log to console in production to avoid noise
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to save inquiry (non-critical):', inquiryError);
          }
        });
      }
    } catch (err) {
      // Set availableRooms to empty array to prevent map error
      setAvailableRooms([]);
      
      // Show detailed error in SweetAlert
      const errorMessage = 
        err.response?.data?.Errors?.ErrorMessage || 
        err.response?.data?.message || 
        err.message ||
        "Failed to fetch available rooms. Please try again.";
      
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: errorMessage,
        confirmButtonColor: "#000000",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // Step 2: Select Room
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);

    const roomRates = calculateRoomRates(room);
    const nights = roomRates?.nights || calculateNights();

    console.log(`[handleSelectRoom] Setting booking details:`, {
      roomName: room.Room_Name,
      baseTotal: roomRates?.roomBaseTotal,
      extrasTotal: roomRates?.extrasTotal,
      total: roomRates?.total,
      nights: nights,
      extraAdults: roomRates?.extraAdults,
      extraChildren: roomRates?.extraChildren,
      breakdown: roomRates?.breakdown
    });

    setBookingDetails({
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      nights,
      totalPrice: roomRates?.roomBaseTotal || 0, // Base rate
      extrasCharge: roomRates?.extrasTotal || 0, // Extra guests charge (for payment calculation)
      breakdown: roomRates?.breakdown || null, // Detailed breakdown
      roomRates: roomRates, // Store full room rates for breakdown display
    });

    setCurrentStep(3); // Move to personal info
  };

  const handleRoomNameClick = (roomName, roomSlug) => {
    if (!roomName) return;
    const canonicalName = sanitizeRoomName(roomName);
    navigate("/rooms", {
      state: {
        selectedRoomName: canonicalName,
        selectedRoomSlug: roomSlug || slugifyRoomName(canonicalName),
      },
    });
  };

  // Step 3: Personal Info validation
  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!personalInfo.title) newErrors.title = "Title is required";
    if (!personalInfo.firstName) newErrors.firstName = "First name is required";
    if (!personalInfo.lastName) newErrors.lastName = "Last name is required";
    if (!personalInfo.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!personalInfo.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(personalInfo.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!personalInfo.address) newErrors.address = "Address is required";
    if (!personalInfo.city) newErrors.city = "City is required";
    if (!personalInfo.state) newErrors.state = "State is required";
    if (!personalInfo.country) newErrors.country = "Country is required";
    if (!personalInfo.zipcode) newErrors.zipcode = "Zipcode is required";

    setPersonalInfoErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInfoSubmit = () => {
    if (!validatePersonalInfo()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentStep(4); // Move to payment
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (personalInfoErrors[name]) {
      setPersonalInfoErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];
  const genders = ["Male", "Female", "Other"];

  // Payment functions (replicated from BookingPayment.jsx)
  const prepareBookingPayload = () => {
    console.log("=== Preparing Booking Payload ===");
    console.log("Room data:", selectedRoom);
    console.log("Personal Info:", personalInfo);
    console.log("Search Data:", searchData);
    console.log("Booking Details:", bookingDetails);
    
    // Log the critical IDs
    console.log("=== CRITICAL IDS FROM ROOM OBJECT ===");
    console.log("Package_Id (will be used for Rateplan_Id):", selectedRoom.Package_Id);
    console.log("roomrateunkid:", selectedRoom.roomrateunkid);
    console.log("ratetypeunkid (Ratetype_Id):", selectedRoom.ratetypeunkid);
    console.log("roomtypeunkid (Roomtype_Id):", selectedRoom.roomtypeunkid);
    console.log("rack_rate (baserate):", selectedRoom.room_rates_info?.rack_rate);
    console.log("extra_adult rack_rate:", selectedRoom.extra_adult_rates_info?.rack_rate);
    console.log("extra_child rack_rate:", selectedRoom.extra_child_rates_info?.rack_rate);
    console.log("\n=== RATE INFO STRUCTURE ===");
    console.log("room_rates_info.exclusive_tax:", selectedRoom.room_rates_info?.exclusive_tax);
    console.log("extra_adult_rates_info.exclusive_tax:", selectedRoom.extra_adult_rates_info?.exclusive_tax);
    console.log("extra_child_rates_info.exclusive_tax:", selectedRoom.extra_child_rates_info?.exclusive_tax);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(bookingDetails.checkIn);
    checkInDate.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      const todayStr = today.toISOString().split('T')[0];
      throw new Error(
        `Check-in date must be today (${todayStr}) or a future date. eZee API does not accept bookings for past dates.`
      );
    }

    // Helper to build nightly rate strings (comma separated) as required by eZee for multiple nights
    // IMPORTANT: This applies discount to base rate before sending to eZee
    // eZee will then add their own GST on top of this discounted rate
    const buildNightlyRateString = (rateInfo) => {
      const exclusiveRates = rateInfo?.exclusive_tax || {};
      const fallbackRate =
        Object.values(exclusiveRates)[0] ??
        rateInfo?.rack_rate ??
        0;

      const nights = bookingDetails?.nights || calculateNights();
      const checkIn = new Date(bookingDetails.checkIn);

      const nightlyRates = [];
      for (let i = 0; i < nights; i++) {
        const date = new Date(checkIn);
        date.setDate(checkIn.getDate() + i);
        const dateKey = formatDateForAPI(date);
        const nightlyRateValue =
          exclusiveRates[dateKey] !== undefined
            ? exclusiveRates[dateKey]
            : fallbackRate;
        
        // Apply 20% discount to the base rate before sending to eZee
        // eZee will handle GST calculation on their side
        // IMPORTANT: Round to 2 decimals to match eZee's precision (not integer)
        const originalRate = parseFloat(nightlyRateValue ?? 0);
        const discountedRate = originalRate * (1 - DISCOUNT_RATE);
        const roundedRate = Math.round(discountedRate * 100) / 100; // Round to 2 decimals
        
        console.log(`[buildNightlyRateString] Night ${i + 1} (${dateKey}):`, {
          originalRate,
          discountPercent: `${DISCOUNT_RATE * 100}%`,
          discountedRate,
          roundedRate,
          sentToEzee: roundedRate,
          note: 'Rounded to 2 decimals to match eZee precision'
        });
        
        nightlyRates.push(String(roundedRate));
      }

      return nightlyRates.join(", ");
    };

    // Build nightly rate strings for base, extra adult, and extra child
    const baseRate = buildNightlyRateString(selectedRoom.room_rates_info);
    const extraAdultRate = buildNightlyRateString(
      selectedRoom.extra_adult_rates_info
    );
    const extraChildRate = buildNightlyRateString(
      selectedRoom.extra_child_rates_info
    );

    const roomDetails = {
      Rateplan_Id: String(selectedRoom.roomrateunkid || ""),
      Ratetype_Id: String(selectedRoom.ratetypeunkid || ""),
      Roomtype_Id: String(selectedRoom.roomtypeunkid || ""),
      baserate: baseRate,
      extradultrate: extraAdultRate,
      extrachildrate: extraChildRate,
      number_adults: String(searchData.adults),
      number_children: String(searchData.children || 0),
      Title: "",
      First_Name: String(personalInfo.firstName || ""),
      Last_Name: String(personalInfo.lastName || ""),
      Gender: "",
      SpecialRequest: "",
    };

    // CRITICAL: ExtraChild_Age is MANDATORY if number_children > 0
    if (searchData.children > 0) {
      roomDetails.ExtraChild_Age = "5";
    }
    
    console.log("=== CONSTRUCTED ROOM DETAILS ===");
    console.log(JSON.stringify(roomDetails, null, 2));
    console.log("=== BASERATE SENT TO EZEE ===");
    console.log("baserate:", baseRate);
    console.log("Note: This should be the DISCOUNTED base rate (20% off), eZee will apply GST");
    console.log("=== PAYMENT CONFIGURATION ===");
    console.log("Booking_Payment_Mode:", "3 (Fully collected - as per eZee recommendation)");
    console.log("paymenttypeunkid:", selectedGateway || "Not set");
    console.log("[IMPORTANT]: Email will be sent when ProcessBooking (ConfirmBooking) is called");
    console.log("[IMPORTANT]: Email should reflect Booking_Payment_Mode: '3' showing payment as collected");

    // Build booking payload - EXACTLY matching Postman collection example
    const bookingPayload = {
      Room_Details: {
        Room_1: roomDetails,
      },
      check_in_date: bookingDetails.checkIn,
      check_out_date: bookingDetails.checkOut,
      Booking_Payment_Mode: "3", // "3" = Fully collected amount (as per eZee recommendation - must be string)
      Email_Address: personalInfo.email,
      Source_Id: "", // "WEB" = Booking Engine source (required for proper email payment status)
      MobileNo: personalInfo.phone || "",
      Address: personalInfo.address || "",
      State: personalInfo.state || "",
      Country: personalInfo.country || "",
      City: personalInfo.city || "",
      Zipcode: personalInfo.zipcode || "",
      Fax: "",
      Device: "",
      Languagekey: "",
      paymenttypeunkid: selectedGateway || "" // Payment gateway ID from eZee (Razorpay gateway ID)
    };

    // Log Source_Id after bookingPayload is created
    console.log("Source_Id:", bookingPayload.Source_Id || "Not set");
    
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

  const openRazorpayPopup = async (reservationNo, totalAmount) => {
    try {
      console.log("\n=== STEP 2: Opening Razorpay Popup ===");
      
      // Create Razorpay order
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/booking/razorpay/create-order`,
        {
          amount: totalAmount,
          currency: selectedRoom.currency_code || "INR",
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
          color: "#D97706"
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
                reservationNo: reservationNo,
                amount: totalAmount,
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
                    room: selectedRoom,
                    searchData: searchData,
                    personalInfo: personalInfo,
                    totalAmount: totalAmount,
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
      const bookingPayload = prepareBookingPayload();

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

      // Calculate total amount (base + extras) to match eZee's calculation
      // eZee calculates: base + extra guests, so our payment must match
      const totalAmount = bookingDetails.totalPrice + (bookingDetails.extrasCharge || 0);
      
      console.log("[Payment Amount Calculation]:", {
        baseTotal: bookingDetails.totalPrice,
        extrasCharge: bookingDetails.extrasCharge || 0,
        totalAmount: totalAmount,
        note: "This should match eZee's total calculation"
      });

      // STEP 2: Open Razorpay payment popup
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    if (!searchData) return 0;
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper to calculate BASE rate only (for listing display - no extra guests)
  // This calculates price for base occupancy only (2 adults, 0 children typically)
  const calculateBaseRateOnly = (room) => {
    if (!room) return null;
    
    const baseExclusive = parseFloat(
      Object.values(room.room_rates_info?.exclusive_tax || {})[0] || 
      room.room_rates_info?.rack_rate || 
      0
    );
    
    if (baseExclusive === 0) return null;
    
    // Apply 20% discount
    let discountedBase = baseExclusive * (1 - DISCOUNT_RATE);
    // Round discounted base to 2 decimals (matching what we send to eZee)
    discountedBase = Math.round(discountedBase * 100) / 100;
    
    // Conditional GST: 5% if base < 7500, else 9% SGST + 9% CGST (to match eZee's calculation)
    let finalPrice;
    if (baseExclusive < GST_THRESHOLD) {
      // 5% GST for low rates
      finalPrice = discountedBase * (1 + GST_RATE_LOW);
    } else {
      // 18% GST split as 9% SGST + 9% CGST (matches eZee's invoice calculation)
      // Calculate SGST and CGST on the rounded discounted base (matching eZee)
      const sgst = Math.round(discountedBase * SGST_RATE * 100) / 100; // Round to 2 decimals
      const cgst = Math.round(discountedBase * CGST_RATE * 100) / 100; // Round to 2 decimals
      finalPrice = discountedBase + sgst + cgst;
    }
    
    return Math.round(finalPrice * 100) / 100; // Round to 2 decimals
  };

  // Helper to calculate room rates for a specific room
  // IMPORTANT: Applies 20% discount + conditional GST (5% if base < 7500, else 18%)
  // This includes extra guests if selected
  const calculateRoomRates = (room) => {
    if (!room || !searchData) return null;
    
    // Verify constants are defined
    if (typeof DISCOUNT_RATE === 'undefined') {
      console.error('[ERROR] DISCOUNT_RATE is undefined!');
      return null;
    }

    const checkIn = new Date(searchData.checkIn);
    const nights = calculateNights();

    const baseAdults = parseInt(room.base_adult_occupancy || "0", 10);
    const baseChildren = parseInt(room.base_child_occupancy || "0", 10);
    const requestedAdults = parseInt(searchData.adults || 0, 10);
    const requestedChildren = parseInt(searchData.children || 0, 10);

    // Calculate extra guests beyond base occupancy
    // Note: base_child_occupancy = 0 means children are NOT included in base rate
    // So any children selected will be charged as extra
    const extraAdults = Math.max(0, requestedAdults - baseAdults);
    const extraChildren = Math.max(0, requestedChildren - baseChildren);
    
    console.log(`[Occupancy Calculation]`, {
      baseAdults,
      baseChildren,
      requestedAdults,
      requestedChildren,
      extraAdults,
      extraChildren,
      note: baseChildren === 0 ? 'Children are NOT included in base rate - all children will be charged as extra' : 'Some children included in base rate'
    });

    let baseTotal = 0;
    let extrasTotal = 0;
    const ratesPerNight = [];

    for (let i = 0; i < nights; i++) {
      const date = new Date(checkIn);
      date.setDate(checkIn.getDate() + i);
      const dateString = formatDateForAPI(date);

      // Base rate (exclusive of tax)
      const exclusiveRates = room.room_rates_info?.exclusive_tax || {};
      const fallbackBaseExclusive =
        Object.values(exclusiveRates)[0] ??
        room.room_rates_info?.rack_rate ??
        room.room_rates_info?.avg_per_night_without_tax ??
        0;

      let baseExclusive =
        exclusiveRates[dateString] !== undefined
          ? parseFloat(exclusiveRates[dateString])
          : parseFloat(fallbackBaseExclusive);
      if (Number.isNaN(baseExclusive)) baseExclusive = 0;

      // Apply 20% discount to base rate (as per eZee recommendation)
      // Formula: discountedBase = baseExclusive * (1 - 0.20) = baseExclusive * 0.80
      const discountMultiplier = 1 - DISCOUNT_RATE; // 0.80
      let discountedBase = baseExclusive * discountMultiplier;
      // Round discounted base to 2 decimals (matching what we send to eZee)
      discountedBase = Math.round(discountedBase * 100) / 100;
      
      // Conditional GST: 5% if base < 7500, else 9% SGST + 9% CGST (to match eZee's calculation)
      let baseTotalNight;
      if (baseExclusive < GST_THRESHOLD) {
        // 5% GST for low rates
        baseTotalNight = discountedBase * (1 + GST_RATE_LOW);
      } else {
        // 18% GST split as 9% SGST + 9% CGST (matches eZee's invoice calculation)
        // Calculate SGST and CGST on the rounded discounted base (matching eZee)
        const sgst = Math.round(discountedBase * SGST_RATE * 100) / 100; // Round to 2 decimals
        const cgst = Math.round(discountedBase * CGST_RATE * 100) / 100; // Round to 2 decimals
        baseTotalNight = discountedBase + sgst + cgst;
      }
      baseTotalNight = Math.round(baseTotalNight * 100) / 100; // Round final to 2 decimals
      
      // Debug logging to verify calculation
      if (baseExclusive > 0) {
        const effectiveGstRate = baseExclusive < GST_THRESHOLD ? GST_RATE_LOW : GST_RATE_HIGH;
        const gstDetails = baseExclusive < GST_THRESHOLD 
          ? { gstRate: GST_RATE_LOW, gstPercent: `${GST_RATE_LOW * 100}%` }
          : { 
              sgstRate: SGST_RATE, 
              cgstRate: CGST_RATE, 
              gstPercent: `${SGST_RATE * 100}% SGST + ${CGST_RATE * 100}% CGST = ${(SGST_RATE + CGST_RATE) * 100}%` 
            };
        
        console.log(`[Rate Calculation Debug - Night ${i + 1}]`, {
          date: dateString,
          originalBase: baseExclusive,
          discountRate: DISCOUNT_RATE,
          discountMultiplier: discountMultiplier,
          discountedBase: discountedBase,
          ...gstDetails,
          finalPrice: baseTotalNight,
          calculation: baseExclusive < GST_THRESHOLD
            ? `${baseExclusive} × ${discountMultiplier} × ${1 + GST_RATE_LOW} = ${baseTotalNight}`
            : `${baseExclusive} × ${discountMultiplier} = ${discountedBase}, then ${discountedBase} + SGST + CGST = ${baseTotalNight}`,
          threshold: `Base ${baseExclusive < GST_THRESHOLD ? '<' : '>='} ${GST_THRESHOLD}, using ${effectiveGstRate * 100}% GST`
        });
      }

      // Extra adult rate (exclusive)
      const extraAdultExclusiveRates =
        room.extra_adult_rates_info?.exclusive_tax || {};
      const fallbackExtraAdultExclusive =
        Object.values(extraAdultExclusiveRates)[0] ??
        room.extra_adult_rates_info?.rack_rate ??
        0;

      let extraAdultExclusive =
        extraAdultExclusiveRates[dateString] !== undefined
          ? parseFloat(extraAdultExclusiveRates[dateString])
          : parseFloat(fallbackExtraAdultExclusive);
      if (Number.isNaN(extraAdultExclusive)) extraAdultExclusive = 0;

      // Apply discount to extra adult rate, then calculate with conditional GST
      let discountedExtraAdult = extraAdultExclusive * (1 - DISCOUNT_RATE);
      // Round discounted rate to 2 decimals (matching what we send to eZee)
      discountedExtraAdult = Math.round(discountedExtraAdult * 100) / 100;
      // Use same GST calculation as base rate (5% if base < 7500, else 9% SGST + 9% CGST)
      let extraAdultWithGst;
      if (baseExclusive < GST_THRESHOLD) {
        extraAdultWithGst = discountedExtraAdult * (1 + GST_RATE_LOW);
      } else {
        const sgst = Math.round(discountedExtraAdult * SGST_RATE * 100) / 100;
        const cgst = Math.round(discountedExtraAdult * CGST_RATE * 100) / 100;
        extraAdultWithGst = discountedExtraAdult + sgst + cgst;
      }
      extraAdultWithGst = Math.round(extraAdultWithGst * 100) / 100;

      // Extra child rate (exclusive)
      const extraChildExclusiveRates =
        room.extra_child_rates_info?.exclusive_tax || {};
      const fallbackExtraChildExclusive =
        Object.values(extraChildExclusiveRates)[0] ??
        room.extra_child_rates_info?.rack_rate ??
        0;

      let extraChildExclusive =
        extraChildExclusiveRates[dateString] !== undefined
          ? parseFloat(extraChildExclusiveRates[dateString])
          : parseFloat(fallbackExtraChildExclusive);
      if (Number.isNaN(extraChildExclusive)) extraChildExclusive = 0;

      // Apply discount to extra child rate, then calculate with conditional GST
      let discountedExtraChild = extraChildExclusive * (1 - DISCOUNT_RATE);
      // Round discounted rate to 2 decimals (matching what we send to eZee)
      discountedExtraChild = Math.round(discountedExtraChild * 100) / 100;
      // Use same GST calculation as base rate (5% if base < 7500, else 9% SGST + 9% CGST)
      let extraChildWithGst;
      if (baseExclusive < GST_THRESHOLD) {
        extraChildWithGst = discountedExtraChild * (1 + GST_RATE_LOW);
      } else {
        const sgst = Math.round(discountedExtraChild * SGST_RATE * 100) / 100;
        const cgst = Math.round(discountedExtraChild * CGST_RATE * 100) / 100;
        extraChildWithGst = discountedExtraChild + sgst + cgst;
      }
      extraChildWithGst = Math.round(extraChildWithGst * 100) / 100;

      // Per-night extras based on search pax
      const extraAdultTotalNight = extraAdults * extraAdultWithGst;
      const extraChildTotalNight = extraChildren * extraChildWithGst;

      const nightTotal =
        baseTotalNight + extraAdultTotalNight + extraChildTotalNight;

      baseTotal += baseTotalNight;
      extrasTotal += extraAdultTotalNight + extraChildTotalNight;

      ratesPerNight.push({
        date: dateString,
        baseRate: Math.round(baseTotalNight),
        extraAdults,
        extraAdultTotal: Math.round(extraAdultTotalNight),
        extraChildren,
        extraChildTotal: Math.round(extraChildTotalNight),
        total: Math.round(nightTotal),
      });
    }

    const total = baseTotal + extrasTotal;

    // Calculate breakdown totals for display
    let baseDiscountedTotal = 0;
    let gstTotal = 0;
    let extraAdultTotal = 0;
    let extraChildTotal = 0;

    // Calculate per-night breakdown and accumulate totals
    for (let i = 0; i < nights; i++) {
      const date = new Date(checkIn);
      date.setDate(checkIn.getDate() + i);
      const dateString = formatDateForAPI(date);

      // Base rate calculation
      const exclusiveRates = room.room_rates_info?.exclusive_tax || {};
      const fallbackBaseExclusive =
        Object.values(exclusiveRates)[0] ??
        room.room_rates_info?.rack_rate ??
        0;
      let baseExclusive =
        exclusiveRates[dateString] !== undefined
          ? parseFloat(exclusiveRates[dateString])
          : parseFloat(fallbackBaseExclusive);
      if (Number.isNaN(baseExclusive)) baseExclusive = 0;

      let discountedBase = baseExclusive * (1 - DISCOUNT_RATE);
      discountedBase = Math.round(discountedBase * 100) / 100;
      baseDiscountedTotal += discountedBase;

      // GST calculation
      if (baseExclusive < GST_THRESHOLD) {
        gstTotal += discountedBase * GST_RATE_LOW;
      } else {
        const sgst = Math.round(discountedBase * SGST_RATE * 100) / 100;
        const cgst = Math.round(discountedBase * CGST_RATE * 100) / 100;
        gstTotal += (sgst + cgst);
      }

      // Extra adult calculation
      if (extraAdults > 0) {
        const extraAdultExclusiveRates = room.extra_adult_rates_info?.exclusive_tax || {};
        const fallbackExtraAdultExclusive =
          Object.values(extraAdultExclusiveRates)[0] ??
          room.extra_adult_rates_info?.rack_rate ??
          0;
        let extraAdultExclusive =
          extraAdultExclusiveRates[dateString] !== undefined
            ? parseFloat(extraAdultExclusiveRates[dateString])
            : parseFloat(fallbackExtraAdultExclusive);
        if (Number.isNaN(extraAdultExclusive)) extraAdultExclusive = 0;

        let discountedExtraAdult = extraAdultExclusive * (1 - DISCOUNT_RATE);
        discountedExtraAdult = Math.round(discountedExtraAdult * 100) / 100;
        
        let extraAdultWithGst;
        if (baseExclusive < GST_THRESHOLD) {
          extraAdultWithGst = discountedExtraAdult * (1 + GST_RATE_LOW);
        } else {
          const sgst = Math.round(discountedExtraAdult * SGST_RATE * 100) / 100;
          const cgst = Math.round(discountedExtraAdult * CGST_RATE * 100) / 100;
          extraAdultWithGst = discountedExtraAdult + sgst + cgst;
        }
        extraAdultTotal += extraAdults * extraAdultWithGst;
      }

      // Extra child calculation
      if (extraChildren > 0) {
        const extraChildExclusiveRates = room.extra_child_rates_info?.exclusive_tax || {};
        const fallbackExtraChildExclusive =
          Object.values(extraChildExclusiveRates)[0] ??
          room.extra_child_rates_info?.rack_rate ??
          0;
        let extraChildExclusive =
          extraChildExclusiveRates[dateString] !== undefined
            ? parseFloat(extraChildExclusiveRates[dateString])
            : parseFloat(fallbackExtraChildExclusive);
        if (Number.isNaN(extraChildExclusive)) extraChildExclusive = 0;

        let discountedExtraChild = extraChildExclusive * (1 - DISCOUNT_RATE);
        discountedExtraChild = Math.round(discountedExtraChild * 100) / 100;
        
        let extraChildWithGst;
        if (baseExclusive < GST_THRESHOLD) {
          extraChildWithGst = discountedExtraChild * (1 + GST_RATE_LOW);
        } else {
          const sgst = Math.round(discountedExtraChild * SGST_RATE * 100) / 100;
          const cgst = Math.round(discountedExtraChild * CGST_RATE * 100) / 100;
          extraChildWithGst = discountedExtraChild + sgst + cgst;
        }
        extraChildWithGst = Math.round(extraChildWithGst * 100) / 100;
        
        const extraChildNightTotal = extraChildren * extraChildWithGst;
        extraChildTotal += extraChildNightTotal;
        
        // Debug logging for extra child calculation
        if (i === 0) { // Log only for first night to avoid spam
          console.log(`[Extra Child Calculation - Night ${i + 1}]`, {
            date: dateString,
            rackRate: extraChildExclusive,
            discountPercent: `${DISCOUNT_RATE * 100}%`,
            discountedRate: discountedExtraChild,
            gstRate: baseExclusive < GST_THRESHOLD ? `${GST_RATE_LOW * 100}%` : `${SGST_RATE * 100}% SGST + ${CGST_RATE * 100}% CGST`,
            rateWithGst: extraChildWithGst,
            numberOfChildren: extraChildren,
            totalForNight: extraChildNightTotal,
            calculation: `${extraChildren} children × ₹${extraChildWithGst.toFixed(2)} = ₹${extraChildNightTotal.toFixed(2)}`
          });
        }
      }
    }

    // Round all totals
    baseDiscountedTotal = Math.round(baseDiscountedTotal * 100) / 100;
    gstTotal = Math.round(gstTotal * 100) / 100;
    extraAdultTotal = Math.round(extraAdultTotal * 100) / 100;
    extraChildTotal = Math.round(extraChildTotal * 100) / 100;

    // Final debug log
    console.log(`[Final Rate Calculation Summary]`, {
      baseTotal: baseTotal,
      extrasTotal: extrasTotal,
      total: total,
      nights: nights,
      extraAdults: extraAdults,
      extraChildren: extraChildren,
      breakdown: {
        baseDiscounted: baseDiscountedTotal,
        gst: gstTotal,
        extraAdults: extraAdultTotal,
        extraChildren: extraChildTotal,
        total: total
      }
    });

    return {
      roomBaseTotal: baseTotal,
      extrasTotal,
      total,
      ratesPerNight,
      nights,
      extraAdults,
      extraChildren,
      breakdown: {
        baseDiscounted: baseDiscountedTotal,
        gst: gstTotal,
        extraAdults: extraAdultTotal,
        extraChildren: extraChildTotal,
        nights: nights,
      },
    };
  };

  // Handle expandable cards with scroll
  const toggleRatesCard = (roomId, elementId) => {
    if (expandedRates === roomId) {
      setExpandedRates(null);
    } else {
      setExpandedRates(roomId);
      setExpandedDetails(null); // Close details if open
      setTimeout(() => {
        const element = document.getElementById(elementId);
        element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  const toggleDetailsCard = (roomId, elementId) => {
    if (expandedDetails === roomId) {
      setExpandedDetails(null);
    } else {
      setExpandedDetails(roomId);
      setExpandedRates(null); // Close rates if open
      setTimeout(() => {
        const element = document.getElementById(elementId);
        element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  };

  // Handle step navigation - allow going back, prevent going forward without validation
  const handleStepNavigation = (targetStep) => {
    // Can always go back to previous steps
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      // Scroll to top when navigating
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Can't go forward without completing current step
    if (targetStep > currentStep) {
      // Step 1 -> Step 2: Need dates selected
      if (currentStep === 1 && targetStep === 2) {
        if (!selectedCheckIn || !selectedCheckOut) {
          alert("Please select check-in and check-out dates first");
          return;
        }
        // Trigger availability check if not done yet
        if (!searchData) {
          handleCheckAvailability();
          return;
        }
      }

      // Step 2 -> Step 3: Need room selected
      if (currentStep === 2 && targetStep === 3) {
        if (!selectedRoom) {
          alert("Please select a room first");
          return;
        }
      }

      // Step 3 -> Step 4: Need personal info validated
      if (currentStep === 3 && targetStep === 4) {
        if (!validatePersonalInfo()) {
          alert("Please fill in all required fields");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // If validation passes, allow navigation
      setCurrentStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Fetch payment gateways when step 4 is reached
  useEffect(() => {
    if (currentStep === 4 && selectedRoom && bookingDetails && personalInfo) {
      fetchPaymentGateways();
    }
  }, [currentStep, selectedRoom, bookingDetails, personalInfo]);

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

  // Render based on current step
  return (
    <div className="min-h-screen bg-[#f5f3ed] pt-20 sm:pt-24 pb-4 sm:pb-6">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Steps */}
        <div className="mb-4 sm:mb-6 overflow-x-auto mt-10">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 min-w-max px-4">
            {/* Step 1: Calendar */}
            <div className="flex items-center">
              <button
                onClick={() => handleStepNavigation(1)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                  currentStep >= 1
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {currentStep > 1 ? "✓" : "1"}
              </button>
              <button
                onClick={() => handleStepNavigation(1)}
                className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium transition-colors ${
                  currentStep === 1 
                    ? "text-gray-900" 
                    : currentStep > 1
                    ? "text-gray-700 hover:text-black cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                Calendar
              </button>
            </div>
            <div
              className={`w-8 sm:w-16 h-0.5 ${
                currentStep >= 2 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 2: Rooms */}
            <div className="flex items-center">
              <button
                onClick={() => handleStepNavigation(2)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                  currentStep >= 2
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {currentStep > 2 ? "✓" : "2"}
              </button>
              <button
                onClick={() => handleStepNavigation(2)}
                className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium transition-colors ${
                  currentStep === 2 
                    ? "text-gray-900" 
                    : currentStep > 2
                    ? "text-gray-700 hover:text-black cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                Rooms
              </button>
            </div>
            <div
              className={`w-8 sm:w-16 h-0.5 ${
                currentStep >= 3 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 3: Details */}
            <div className="flex items-center">
              <button
                onClick={() => handleStepNavigation(3)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                  currentStep >= 3
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {currentStep > 3 ? "✓" : "3"}
              </button>
              <button
                onClick={() => handleStepNavigation(3)}
                className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium transition-colors ${
                  currentStep === 3 
                    ? "text-gray-900" 
                    : currentStep > 3
                    ? "text-gray-700 hover:text-black cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                Details
              </button>
            </div>
            <div
              className={`w-8 sm:w-16 h-0.5 ${
                currentStep >= 4 ? "bg-black" : "bg-gray-300"
              }`}
            ></div>

            {/* Step 4: Payment */}
            <div className="flex items-center">
              <button
                onClick={() => handleStepNavigation(4)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                  currentStep >= 4
                    ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                4
              </button>
              <button
                onClick={() => handleStepNavigation(4)}
                className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium transition-colors ${
                  currentStep === 4 
                    ? "text-gray-900" 
                    : currentStep > 4
                    ? "text-gray-700 hover:text-black cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                Payment
              </button>
            </div>
          </div>
        </div>

        {/* Step 1: Calendar */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-5"
          >
            {/* Title with Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
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
              <h2 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
                Select Your Dates
              </h2>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Calendar Section */}
              <div className="lg:col-span-2">

                {/* Two Calendars Side by Side */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3">
                  {/* Current Month Calendar */}
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 text-center">
                      {monthNames[month].toUpperCase()} {year}
                    </div>
                    <div className="grid grid-cols-7 gap-0.5">
                      {/* Day headers */}
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-[9px] sm:text-[10px] font-semibold text-gray-600 py-1"
                          >
                            {day.substring(0, 3)}
                          </div>
                        )
                      )}

                      {/* Empty cells */}
                      {[...Array(startingDayOfWeek)].map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square"></div>
                      ))}

                      {/* Calendar days */}
                      {[...Array(daysInMonth)].map((_, index) => {
                        const day = index + 1;
                        const date = new Date(year, month, day);
                        date.setHours(0, 0, 0, 0);
                        const available = isDateAvailable(date);
                        const inRange = isDateInRange(date);
                        const isCheckIn =
                          selectedCheckIn &&
                          date.getTime() === selectedCheckIn.getTime();
                        const isCheckOut =
                          selectedCheckOut &&
                          date.getTime() === selectedCheckOut.getTime();

                        return (
                          <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            disabled={!available}
                            className={`
                              aspect-square rounded text-[10px] sm:text-xs font-medium transition-all
                              ${
                                !available
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : ""
                              }
                              ${
                                inRange && !isCheckIn && !isCheckOut
                                  ? "bg-[#f5f3ed] text-gray-900 border border-gray-300"
                                  : ""
                              }
                              ${
                                isCheckIn || isCheckOut
                                  ? "bg-black text-white font-bold"
                                  : ""
                              }
                              ${
                                available && !inRange && !isCheckIn && !isCheckOut
                                  ? "hover:bg-gray-100 cursor-pointer text-gray-700"
                                  : ""
                              }
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next Month Calendar */}
                  {(() => {
                    const nextMonthDate = new Date(year, month + 1, 1);
                    const nextYear = nextMonthDate.getFullYear();
                    const nextMonth = nextMonthDate.getMonth();
                    const nextFirstDay = new Date(nextYear, nextMonth, 1);
                    const nextLastDay = new Date(nextYear, nextMonth + 1, 0);
                    const nextDaysInMonth = nextLastDay.getDate();
                    const nextStartingDayOfWeek = nextFirstDay.getDay();

                    return (
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 text-center">
                          {monthNames[nextMonth].toUpperCase()} {nextYear}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {/* Day headers */}
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                            (day) => (
                              <div
                                key={day}
                                className="text-center text-[9px] sm:text-[10px] font-semibold text-gray-600 py-1"
                              >
                                {day.substring(0, 3)}
                              </div>
                            )
                          )}

                          {/* Empty cells */}
                          {[...Array(nextStartingDayOfWeek)].map((_, index) => (
                            <div key={`empty-next-${index}`} className="aspect-square"></div>
                          ))}

                          {/* Calendar days */}
                          {[...Array(nextDaysInMonth)].map((_, index) => {
                            const day = index + 1;
                            const date = new Date(nextYear, nextMonth, day);
                            date.setHours(0, 0, 0, 0);
                            const available = isDateAvailable(date);
                            const inRange = isDateInRange(date);
                            const isCheckIn =
                              selectedCheckIn &&
                              date.getTime() === selectedCheckIn.getTime();
                            const isCheckOut =
                              selectedCheckOut &&
                              date.getTime() === selectedCheckOut.getTime();

                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  const clickedDate = new Date(nextYear, nextMonth, day);
                                  clickedDate.setHours(0, 0, 0, 0);

                                  if (!isDateAvailable(clickedDate)) return;

                                  // If no check-in is selected, set it as check-in
                                  if (!selectedCheckIn) {
                                    setSelectedCheckIn(clickedDate);
                                    setSelectedCheckOut(null);
                                    setSelectingCheckOut(true);
                                    return;
                                  }

                                  // If check-in is selected but no check-out
                                  if (selectedCheckIn && !selectedCheckOut) {
                                    // If clicked date is before check-in, make it the new check-in
                                    if (clickedDate < selectedCheckIn) {
                                      setSelectedCheckIn(clickedDate);
                                      setSelectedCheckOut(null);
                                    } else {
                                      // Otherwise, set it as check-out
                                      setSelectedCheckOut(clickedDate);
                                      setSelectingCheckOut(false);
                                    }
                                    return;
                                  }

                                  // If both dates are selected, start a new selection
                                  if (selectedCheckIn && selectedCheckOut) {
                                    setSelectedCheckIn(clickedDate);
                                    setSelectedCheckOut(null);
                                    setSelectingCheckOut(true);
                                  }
                                }}
                                disabled={!available}
                                className={`
                                  aspect-square rounded text-[10px] sm:text-xs font-medium transition-all
                                  ${
                                    !available
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : ""
                                  }
                                  ${
                                    inRange && !isCheckIn && !isCheckOut
                                      ? "bg-[#f5f3ed] text-gray-900 border border-gray-300"
                                      : ""
                                  }
                                  ${
                                    isCheckIn || isCheckOut
                                      ? "bg-black text-white font-bold"
                                      : ""
                                  }
                                  ${
                                    available && !inRange && !isCheckIn && !isCheckOut
                                      ? "hover:bg-gray-100 cursor-pointer text-gray-700"
                                      : ""
                                  }
                                `}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-black rounded"></div>
                    <span>Selected dates</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[#f5f3ed] border border-gray-300 rounded"></div>
                    <span>Date range</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                    <span>Not available</span>
                  </div>
                </div>

                {/* Modify Reservation Link */}
                <div className="text-right">
                  <button
                    onClick={() => {
                      setSelectedCheckIn(null);
                      setSelectedCheckOut(null);
                      setSelectingCheckOut(false);
                    }}
                    className="text-xs sm:text-sm text-gray-700 hover:text-black underline"
                  >
                    modify reservation
                  </button>
                </div>
              </div>

              {/* Reservation Summary Panel */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-4 sm:p-5">
                  {/* ARRIVAL / DEPARTURE Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        !selectingCheckOut
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSelectingCheckOut(false)}
                    >
                      ARRIVAL
                    </button>
                    <button
                      className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        selectingCheckOut
                          ? "bg-black text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSelectingCheckOut(true)}
                    >
                      DEPARTURE
                    </button>
                  </div>

                  {/* Selected Dates Display */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                        {selectedCheckIn
                          ? selectedCheckIn.getDate()
                          : "—"}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-medium">
                        {selectedCheckIn
                          ? monthNames[selectedCheckIn.getMonth()]
                          : "Select date"}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                        {selectedCheckOut
                          ? selectedCheckOut.getDate()
                          : "—"}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-medium">
                        {selectedCheckOut
                          ? monthNames[selectedCheckOut.getMonth()]
                          : "Select date"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-3 py-2.5 text-sm font-medium appearance-none hover:border-gray-400 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-3 py-2.5 text-sm font-medium appearance-none hover:border-gray-400 focus:outline-none focus:border-black"
                        required
                      />
                    </div>
                  </div>

                  {/* Guest Selection Dropdowns */}
                  <div className="space-y-2.5 mb-4">
                    <div className="relative">
                      <select
                        value={adults}
                        onChange={(e) => setAdults(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-3 py-2.5 text-sm font-medium appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:border-black pr-8"
                      >
                        {(() => {
                          const options = [];
                          // Allow 1-12 adults (reasonable max for 4 rooms: 4 rooms × 3 adults = 12)
                          for (let i = 1; i <= 12; i++) {
                            options.push(
                              <option key={i} value={i}>
                                {i} {i === 1 ? "Adult" : "Adults"}
                              </option>
                            );
                          }
                          return options;
                        })()}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        value={children}
                        onChange={(e) => setChildren(e.target.value)}
                        className="w-full bg-white border-2 border-gray-200 text-gray-900 rounded-lg px-3 py-2.5 text-sm font-medium appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:border-black pr-8"
                      >
                        {(() => {
                          const options = [];
                          // Allow 0-8 children (reasonable max for 4 rooms: 4 rooms × 2 children = 8)
                          for (let i = 0; i <= 8; i++) {
                            options.push(
                              <option key={i} value={i}>
                                {i} {i === 1 ? "Child" : "Children"}
                              </option>
                            );
                          }
                          return options;
                        })()}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 text-center mt-2">
                      Number of rooms will be calculated automatically based on your selection
                    </div>
                  </div>

                  {/* CHECK AVAILABILITY Button */}
                  <button
                    onClick={handleCheckAvailability}
                    disabled={!selectedCheckIn || !selectedCheckOut || searchLoading}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
                      selectedCheckIn && selectedCheckOut && !searchLoading
                        ? "bg-black text-white hover:bg-gray-800 shadow-md"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {searchLoading ? "Checking..." : "CHECK AVAILABILITY"}
                  </button>

                  {/* Nights Selected Text */}
                  {selectedCheckIn && selectedCheckOut && (
                    <p className="text-xs text-center mt-3 text-gray-600">
                      {(() => {
                        const checkIn = new Date(selectedCheckIn);
                        const checkOut = new Date(selectedCheckOut);
                        const diffTime = Math.abs(checkOut - checkIn);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays;
                      })()} night(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Select Room */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Your Selection Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-light text-gray-800 mb-4">
                Your Selection
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Check In</p>
                  <p className="text-sm font-semibold">
                    {formatDate(searchData.checkIn)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Check Out</p>
                  <p className="text-sm font-semibold">
                    {formatDate(searchData.checkOut)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Rooms</p>
                  <p className="text-sm font-semibold">
                    {searchData.rooms} {searchData.rooms === 1 ? "Room" : "Rooms"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Guests</p>
                  <p className="text-sm font-semibold">
                    {searchData.adults} Adults
                    {searchData.children > 0 &&
                      `, ${searchData.children} Children`}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-sm font-semibold">
                    {calculateNights()} Night{calculateNights() > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Modify Search
              </button>
            </div>

            {/* Rooms List */}
            {availableRooms.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">No rooms available</p>
              </div>
            ) : (
              <div>
                <p className="text-center text-gray-600 mb-6">
                  We found {availableRooms.length} accommodation
                  {availableRooms.length > 1 ? "s" : ""}
                </p>
                <div className="space-y-4">
                  {availableRooms.map((room, index) => {
                    const displayName = room.Room_Name || room.Roomtype_Name;
                    const roomData = findRoomByName(displayName);
                    
                    // Don't calculate full rates during render - only when rates card is expanded
                    // For listing view, we use calculateBaseRateOnly which is much faster
                    const isRatesExpanded = expandedRates === room.roomrateunkid;
                    const isDetailsExpanded = expandedDetails === room.roomrateunkid;
                    
                    // Calculate room rates only when expanded (lazy loading for performance)
                    // This prevents blocking the UI during initial render
                    const roomRates = isRatesExpanded ? calculateRoomRates(room) : null;
                    const canonicalName =
                      roomData?.baseName ||
                      sanitizeRoomName(displayName) ||
                      displayName;
                    const roomSlug =
                      roomData?.slug || slugifyRoomName(canonicalName);
                    
                    return (
                      <div key={room.roomrateunkid || index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.05, 0.2) }}
                          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
                              {room.room_main_image ? (
                                <img
                                  src={room.room_main_image}
                                  alt={room.Room_Name || "Room"}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                  <svg
                                    className="w-16 h-16 text-gray-700"
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
                            </div>

                            {/* Details */}
                            <div className="p-4 sm:p-6 lg:p-8">
                              <h3 className="text-xl sm:text-2xl font-serif text-black mb-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoomNameClick(canonicalName, roomSlug)
                                  }
                                  className="text-left hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                >
                                  {displayName}
                                </button>
                              </h3>
                              <p className="text-sm text-gray-600 mb-6">
                                {roomData?.description || room.Room_Description || "Escape to luxury and comfort."}
                              </p>

                              {/* Price & CTA */}
                              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-10 mb-6">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">From</p>
                                  <p className="text-2xl sm:text-3xl font-serif text-black">
                                    {room.currency_sign}
                                    {(() => {
                                      // Calculate base rate only (no extra guests) for listing display
                                      const basePrice = calculateBaseRateOnly(room);
                                      return basePrice 
                                        ? basePrice.toLocaleString()
                                        : (room.room_rates_info?.avg_per_night_after_discount || 0).toLocaleString();
                                    })()}
                                    <span className="text-sm text-gray-600 font-normal"> / night</span>
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Including GST (base rate for {room.base_adult_occupancy || 2} adults{room.base_child_occupancy > 0 ? `, ${room.base_child_occupancy} child${room.base_child_occupancy > 1 ? 'ren' : ''}` : ''})
                                  </p>
                                </div>

                                {/* View Rates Button */}
                                <button
                                  onClick={() => toggleRatesCard(room.roomrateunkid, `rates-${room.roomrateunkid}`)}
                                  className="w-full sm:w-[250px] px-6 py-3 bg-black hover:bg-gray-800 text-white text-sm uppercase tracking-wider transition-all duration-300 font-medium rounded-full text-center"
                                >
                                  {isRatesExpanded ? "Hide rates" : "View Rates & Offers"}
                                </button>
                              </div>

                              {/* Amenities Grid */}
                              {roomData?.amenities && (
                                <div className="mb-6">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    {roomData.amenities.map((amenity, idx) => {
                                      const IconComponent = amenity.icon;
                                      return (
                                        <div key={idx} className="flex flex-col items-center text-center">
                                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f5f3ed] rounded-full flex items-center justify-center mb-2 text-gray-700">
                                            <IconComponent className="w-4 h-4 sm:w-6 sm:h-6" />
                                          </div>
                                          <p className="text-[10px] sm:text-xs text-gray-600">{amenity.label}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Additional Details Link */}
                              <div className="text-center sm:text-right">
                                <button
                                  onClick={() => toggleDetailsCard(room.roomrateunkid, `details-${room.roomrateunkid}`)}
                                  className=" text-xs sm:text-sm text-gray-700 hover:text-black underline"
                                >
                                  {isDetailsExpanded ? "Additional Details ↑" : "Additional Details ↓"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Expanded Rates Card */}
                       {isRatesExpanded && roomRates && (() => {
                         const breakdown = roomRates?.breakdown;
                         return (
                          <motion.div
                            id={`rates-${room.roomrateunkid}`}
                            initial={{ opacity: 0, height: 0 } }
                            animate={{ opacity: 1, height: "auto" } }
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white border border-gray-200 rounded-b-lg overflow-hidden mt-6 sm:mt-8 rounded-md"
                          >
                            <div className="p-4 sm:p-6">
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-6">
                                {/* Stay Includes */}
                                <div className="w-full lg:max-w-md">
                                  <h4 className="text-base font-semibold mb-3">Standard Daily Rate</h4>
                                  <p className="text-sm font-medium text-gray-600 mb-2">The stay includes:</p>
                                  <ul className="space-y-2 text-sm text-gray-700">
                                    {roomData?.stayIncludes?.map((item, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Price Breakdown & actions */}
                                <div className="w-full lg:max-w-md flex flex-col gap-4">
                                  {/* Detailed Breakdown */}
                                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <h5 className="font-semibold text-sm mb-3">Price Breakdown ({roomRates?.nights || calculateNights()} {roomRates?.nights === 1 ? 'Night' : 'Nights'})</h5>
                                    
                                    {/* Base Rate */}
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Base Rate ({room.base_adult_occupancy || 2} Adults)</span>
                                      <span className="font-semibold">
                                        {room.currency_sign}{breakdown?.baseDiscounted?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                      </span>
                                    </div>

                                    {/* GST */}
                                    {breakdown?.gst > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">GST</span>
                                        <span className="font-semibold">
                                          {room.currency_sign}{breakdown.gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    )}

                                    {/* Extra Adults */}
                                    {roomRates?.extraAdults > 0 && breakdown?.extraAdults > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Extra Adults ({roomRates.extraAdults})</span>
                                        <span className="font-semibold">
                                          {room.currency_sign}{breakdown.extraAdults.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    )}

                                    {/* Extra Children */}
                                    {roomRates?.extraChildren > 0 && breakdown?.extraChildren > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Extra Children ({roomRates.extraChildren})</span>
                                        <span className="font-semibold">
                                          {room.currency_sign}{breakdown.extraChildren.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    )}

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                                      <span className="font-bold text-base">Total</span>
                                      <span className="font-bold text-lg">
                                        {room.currency_sign}{roomRates?.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex flex-col gap-3">
                                    <button
                                      onClick={() => setShowBookingConditions(true)}
                                      className="text-sm text-gray-700 underline hover:text-black text-center"
                                    >
                                      Booking policies
                                    </button>

                                    <button
                                      onClick={() => handleSelectRoom(room)}
                                      className="w-full rounded-full px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm tracking-wider transition-all duration-300 text-center"
                                    >
                                      Reserve
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                         );
                       })()}



                        {/* Expanded Details Card */}
                        {isDetailsExpanded && (
                          <motion.div
                            id={`details-${room.roomrateunkid}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white border border-gray-200 border-t-0 rounded-b-lg overflow-hidden mt-8 rounded-md"
                          >
                            <div className="p-4 sm:p-6">
                              <h4 className="text-base font-semibold mb-4">Features</h4>
                              {roomData?.features && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {roomData.features.map((feature, idx) => (
                                    <div key={idx} className="space-y-2">
                                      <div className="relative h-32 sm:h-40 overflow-hidden rounded-lg">
                                        <img
                                          src={feature.image}
                                          alt={feature.title}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-700 font-medium">{feature.title}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Booking Conditions Modal */}
            {showBookingConditions && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-black">Booking Conditions</h3>
                    <button
                      onClick={() => setShowBookingConditions(false)}
                      className="text-gray-600 hover:text-black"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Cancellation Policy */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Cancellation policy</h4>
                      <p className="text-sm text-gray-700">
                        Cancellation between 15 days and the day before arrival (within 12:00pm local time) will incur 50% charge plus taxes. Cancellation within 24 hours before the arrival date (from 12:00pm local time), early departure, no show will incur 100% charge plus taxes.
                      </p>
                    </div>
                    {/*Extra charges*/}
                    {/* Extra Occupancy Policy */}
<div>
  <h4 className="font-semibold text-black mb-2">Extra occupancy policy</h4>
  <p className="text-sm text-gray-700">                                                                                        
    All rooms are configured for a maximum occupancy of 2 guests. For bookings made
    for 3 guests, an extra mattress will be arranged and additional charges will apply.
  </p>
</div>


                    {/* Guarantee Policy */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Guarantee policy</h4>
                      <p className="text-sm text-gray-700">
                        Valid credit card details required to guarantee reservation. Full prepayment required 15 days prior to arrival.
                      </p>
                    </div>

                    {/* Children Policy */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Children policy</h4>
                      <p className="text-sm text-gray-700">
                        Children aged 11 years and older are fully charged.
                      </p>
                    </div>

                    {/* Check In Policy */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Check in policy</h4>
                      <p className="text-sm text-gray-700">
                        Check-in after 2:00 pm. Check-out before 12:00 pm.
                      </p>
                    </div>

                    {/* Pet Policy */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Pet policy</h4>
                      <p className="text-sm text-gray-700">
                        Small pets are allowed with prior approval by the property.
                      </p>
                    </div>

                    {/* Charges Section */}
                    {/* <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-black mb-4">Charges</h4>
                      {availableRooms.length > 0 && (() => {
                        const sampleRoom = availableRooms[0];
                        const rates = calculateRoomRates(sampleRoom);
                        if (!rates) return null;
                        
                        return (
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-gray-600 mb-2">Rates (per night):</p>
                              {rates.ratesPerNight.map((rate, idx) => (
                                <p key={idx} className="text-gray-700">
                                  {new Date(rate.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} {sampleRoom.currency_sign}{rate.rate.toLocaleString()}
                                </p>
                              ))}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Room Total:</span>
                              <span className="font-semibold">{sampleRoom.currency_sign}{rates.roomTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Taxes & fees:</span>
                              <span className="font-semibold">{sampleRoom.currency_sign}{rates.taxes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">VAT:</span>
                              <span className="font-semibold">{sampleRoom.currency_sign}{rates.taxes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-200">
                              <span className="text-gray-600">Deposit due</span>
                              <span className="font-semibold">{sampleRoom.currency_sign}{rates.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Remaining balance</span>
                              <span className="font-semibold">{sampleRoom.currency_sign}0</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                              <span>Total:</span>
                              <span>{sampleRoom.currency_sign}{rates.total.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Including taxes & fees</p>
                          </div>
                        );
                      })()}
                    </div> */}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Personal Info */}
        {currentStep === 3 && selectedRoom && bookingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-4 sm:mb-6">
                    Guest Details
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Title <span className="text-gray-700">*</span>
                        </label>
                        <select
                          name="title"
                          value={personalInfo.title}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                            personalInfoErrors.title
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Title</option>
                          {titles.map((title) => (
                            <option key={title} value={title}>
                              {title}
                            </option>
                          ))}
                        </select>
                        {personalInfoErrors.title && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            {personalInfoErrors.title}
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
                          value={personalInfo.gender}
                          onChange={handlePersonalInfoChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
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
                          First Name <span className="text-gray-700">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={personalInfo.firstName}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                            personalInfoErrors.firstName
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter first name"
                        />
                        {personalInfoErrors.firstName && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            {personalInfoErrors.firstName}
                          </p>
                        )}
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Last Name <span className="text-gray-700">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={personalInfo.lastName}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                            personalInfoErrors.lastName
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter last name"
                        />
                        {personalInfoErrors.lastName && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            {personalInfoErrors.lastName}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Email Address <span className="text-gray-700">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                            personalInfoErrors.email
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {personalInfoErrors.email && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            {personalInfoErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                          Mobile Number <span className="text-gray-700">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                            personalInfoErrors.phone
                              ? "border-gray-600"
                              : "border-gray-300"
                          }`}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                        />
                        {personalInfoErrors.phone && (
                          <p className="mt-1 text-xs sm:text-sm text-gray-700">
                            {personalInfoErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Address Section */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
                        Address
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Street Address <span className="text-gray-700">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={personalInfo.address}
                            onChange={handlePersonalInfoChange}
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                              personalInfoErrors.address
                                ? "border-gray-600"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter your address"
                          />
                          {personalInfoErrors.address && (
                            <p className="mt-1 text-xs sm:text-sm text-gray-700">
                              {personalInfoErrors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              City <span className="text-gray-700">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={personalInfo.city}
                              onChange={handlePersonalInfoChange}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                                personalInfoErrors.city
                                  ? "border-gray-600"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter city"
                            />
                            {personalInfoErrors.city && (
                              <p className="mt-1 text-xs sm:text-sm text-gray-700">
                                {personalInfoErrors.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              State <span className="text-gray-700">*</span>
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={personalInfo.state}
                              onChange={handlePersonalInfoChange}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                                personalInfoErrors.state
                                  ? "border-gray-600"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter state"
                            />
                            {personalInfoErrors.state && (
                              <p className="mt-1 text-xs sm:text-sm text-gray-700">
                                {personalInfoErrors.state}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              Country <span className="text-gray-700">*</span>
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={personalInfo.country}
                              onChange={handlePersonalInfoChange}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                                personalInfoErrors.country
                                  ? "border-gray-600"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter country"
                            />
                            {personalInfoErrors.country && (
                              <p className="mt-1 text-xs sm:text-sm text-gray-700">
                                {personalInfoErrors.country}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              Zipcode <span className="text-gray-700">*</span>
                            </label>
                            <input
                              type="text"
                              name="zipcode"
                              value={personalInfo.zipcode}
                              onChange={handlePersonalInfoChange}
                              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base ${
                                personalInfoErrors.zipcode
                                  ? "border-gray-600"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter zipcode"
                              maxLength="6"
                            />
                            {personalInfoErrors.zipcode && (
                              <p className="mt-1 text-xs sm:text-sm text-gray-700">
                                {personalInfoErrors.zipcode}
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
                        value={personalInfo.specialRequest}
                        onChange={handlePersonalInfoChange}
                        rows="4"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                        placeholder="Any special requirements or requests?"
                      ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-3 sm:pt-4 gap-3 sm:gap-0">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handlePersonalInfoSubmit}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold text-sm sm:text-base order-1 sm:order-2"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h3 className="text-xl font-serif font-bold mb-4">
                    Room Summary
                  </h3>

                  {selectedRoom.room_main_image && (
                    <img
                      src={selectedRoom.room_main_image}
                      alt={selectedRoom.Room_Name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <h4 className="font-semibold text-lg mb-2">
                    {selectedRoom.Room_Name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {selectedRoom.Roomtype_Name}
                  </p>

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
                      <span className="font-semibold">
                        {bookingDetails.nights}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-semibold">
                        {searchData.adults} Adults, {searchData.children || 0}{" "}
                        Children
                      </span>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="pt-4 space-y-2">
                    {bookingDetails.breakdown && (
                      <>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Base Rate ({selectedRoom.base_adult_occupancy || 2} Adults)</span>
                          <span className="font-semibold">
                            {selectedRoom.currency_sign}
                            {bookingDetails.breakdown.baseDiscounted?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        {bookingDetails.breakdown.gst > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">GST</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.gst.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {bookingDetails.roomRates?.extraAdults > 0 && bookingDetails.breakdown.extraAdults > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Extra Adults ({bookingDetails.roomRates.extraAdults})</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.extraAdults.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {bookingDetails.roomRates?.extraChildren > 0 && bookingDetails.breakdown.extraChildren > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Extra Children ({bookingDetails.roomRates.extraChildren})</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.extraChildren.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-black">
                        {selectedRoom.currency_sign}
                        {bookingDetails.roomRates?.total 
                          ? bookingDetails.roomRates.total.toFixed(2)
                          : (bookingDetails.totalPrice + (bookingDetails.extrasCharge || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Payment */}
        {currentStep === 4 && selectedRoom && bookingDetails && personalInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Payment Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
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
                        <span className="px-2.5 sm:px-3 py-1 bg-[#f5f3ed] text-black border border-gray-300 text-[10px] sm:text-xs font-semibold rounded-full">
                          ✓ Secure
                        </span>
                      </div>
                      
                      {/* Selected Gateway Display */}
                      {paymentGateways.map((gateway) => (
                        gateway.paymenttypeunkid === selectedGateway && (
                          <div
                            key={gateway.paymenttypeunkid}
                            className="p-4 sm:p-6 border-2 border-black bg-[#f5f3ed] rounded-lg"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                              <div>
                                <p className="font-semibold text-base sm:text-lg">{gateway.paymenttype}</p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  Click "Proceed to Payment" to complete your booking securely
                                </p>
                              </div>
                              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          </div>
                        )
                      ))}

                      {/* Payment Info */}
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#f5f3ed] border border-gray-300 rounded-lg">
                    <h4 className="font-semibold text-black mb-2 flex items-center text-sm sm:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Payment Process
                    </h4>
                    <ul className="text-xs sm:text-sm text-gray-700 space-y-1 ml-6 sm:ml-7">
                          <li>• Your booking will be created with a reservation number</li>
                          <li>• Razorpay payment popup will open automatically</li>
                          <li>• Choose your payment method (UPI, Cards, NetBanking, etc.)</li>
                          <li>• On successful payment, booking is instantly confirmed</li>
                          <li>• You'll receive confirmation via email immediately</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-[#f5f3ed] border border-gray-300 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-black mb-2">
                    Payment Gateway Not Configured
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700">
                        Online payment is currently unavailable. Please contact the resort directly to complete your booking.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-6 sm:pt-8 mt-6 sm:mt-8 border-t gap-3 sm:gap-0">
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={processing}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 sm:order-1"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={processing || paymentGateways.length === 0}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
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
                </div>
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 sticky top-8">
                  <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 sm:mb-4">
                    Final Summary
                  </h3>

                  {/* Room Details */}
                  <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-auto lg:min-h-full overflow-hidden">
                          {selectedRoom.room_main_image ? (
                            <img
                              src={selectedRoom.room_main_image}
                              alt={selectedRoom.Room_Name || "Room"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg
                                className="w-16 h-16 text-gray-700"
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
                        </div>
                    <h4 className="font-semibold text-sm sm:text-base">{selectedRoom.Room_Name}</h4>
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
                    {bookingDetails.breakdown && (
                      <>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Base Rate ({selectedRoom.base_adult_occupancy || 2} Adults)</span>
                          <span className="font-semibold">
                            {selectedRoom.currency_sign}
                            {bookingDetails.breakdown.baseDiscounted?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        {bookingDetails.breakdown.gst > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">GST</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.gst.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {bookingDetails.roomRates?.extraAdults > 0 && bookingDetails.breakdown.extraAdults > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Extra Adults ({bookingDetails.roomRates.extraAdults})</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.extraAdults.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {bookingDetails.roomRates?.extraChildren > 0 && bookingDetails.breakdown.extraChildren > 0 && (
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Extra Children ({bookingDetails.roomRates.extraChildren})</span>
                            <span className="font-semibold">
                              {selectedRoom.currency_sign}
                              {bookingDetails.breakdown.extraChildren.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {!bookingDetails.breakdown && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Room Rate</span>
                        <span className="font-semibold">
                          {selectedRoom.currency_sign}
                          {bookingDetails.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                      <span>Total to Pay</span>
                      <span className="text-black">
                        {selectedRoom.currency_sign}
                        {bookingDetails.roomRates?.total 
                          ? bookingDetails.roomRates.total.toFixed(2)
                          : (bookingDetails.totalPrice + (bookingDetails.extrasCharge || 0)).toFixed(2)}
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
                      {selectedRoom.check_in_time || "2:00 PM"} and check-out time is before{" "}
                      {selectedRoom.check_out_time || "12:00 PM"}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UnifiedBooking;