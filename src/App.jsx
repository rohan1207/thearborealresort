import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SEOScripts from "./components/SEOScripts";
import ErrorBoundary from "./components/ErrorBoundary";

import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import GalleryPage from "./pages/GalleryPage";
import Availability from "./pages/Availability";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingError from "./pages/BookingError";
import BookingErrorTest from "./pages/BookingErrorTest";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import WhatsAppFloat from "./components/WhatsAppFloat";
import UnifiedBooking from "./pages/UnifiedBooking";
import LandingPage from "./pages/LandingPage";
import ActivityTemplate from "./pages/ActivityTemplate";

// New Booking Flow Pages
import BookingCalendar from "./pages/NewBooking/BookingCalendar";
import BookingPersonalInfo from "./pages/NewBooking/BookingPersonalInfo";
import BookingExtras from "./pages/NewBooking/BookingExtras";
import BookingPayment from "./pages/NewBooking/BookingPayment";
import UpdatedRooms from "./pages/UpdatedRooms";

const AppLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      {/* SEO Scripts - Analytics, Verification, Custom Scripts */}
      <SEOScripts />
      {/* Keep Navbar outside SmoothScroll/Lenis so fixed positioning is not affected */}
      {!isLandingPage && <Navbar />}
      {!isLandingPage && <WhatsAppFloat />}
      <SmoothScroll>
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/rooms" element={<UpdatedRooms />} />
            <Route path="/reservation" element={<div>Reservation</div>} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/services" element={<Home />} />
            <Route path="/availability" element={<Availability />} />

            {/* Unified Booking Route */}
            <Route path="/booking" element={<UnifiedBooking />} />

            {/* New Booking Flow Routes */}
            <Route path="/booking/calendar" element={<BookingCalendar />} />
            <Route
              path="/booking/personal-info"
              element={<BookingPersonalInfo />}
            />
            <Route path="/booking/extras" element={<BookingExtras />} />
            <Route path="/booking/payment" element={<BookingPayment />} />

            {/* Old booking routes (kept for backward compatibility) */}
            <Route path="/booking-old" element={<BookingForm />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/booking-error" element={<BookingError />} />
            <Route
              path="/booking-error-test"
              element={<BookingErrorTest />}
            />

            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/activities" element={<ActivityTemplate />} />
            <Route path="/activities/:activityId" element={<ActivityTemplate />} />
          </Routes>
        </ErrorBoundary>
        {!isLandingPage && <Footer />}
      </SmoothScroll>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
