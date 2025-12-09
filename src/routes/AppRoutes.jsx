import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactUs from "../pages/ContactUs";
import ScrollToTop from "../components/ScrollToTop";
import Home from "../pages/Home";
import Rooms from "../pages/Rooms";
import Services from "../pages/Services";
import Availability from "../pages/Availability";

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/availability" element={<Availability />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
