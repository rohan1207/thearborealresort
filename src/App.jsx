import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
import UnifiedBooking from "./pages/UnifiedBooking";

// New Booking Flow Pages
import BookingCalendar from "./pages/NewBooking/BookingCalendar";
import BookingPersonalInfo from "./pages/NewBooking/BookingPersonalInfo";
import BookingExtras from "./pages/NewBooking/BookingExtras";
import BookingPayment from "./pages/NewBooking/BookingPayment";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <SmoothScroll>
          <Navbar />
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/reservation" element={<div>Reservation</div>} />
          <Route path="/gallery" element={<Home />} />
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
          <Route
            path="/booking-error"
            element={<BookingError />}
          />
          <Route
            path="/booking-error-test"
            element={<BookingErrorTest />}
          />

          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Routes>
        <Footer />
        </SmoothScroll>
      </BrowserRouter>
    </>
  );
};

export default App;
