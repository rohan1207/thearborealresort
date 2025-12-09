import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Rooms", path: "/rooms" },
    
  ];

  const exploreLinks = [
    { name: "Blogs", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Availability", path: "/booking" },
    
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="relative bg-[#f5f3ed] border-t border-gray-200">
      {/* Top Decorative Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="space-y-8 sm:space-y-10 mb-8 sm:mb-10 md:mb-12">
          {/* Brand Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-3 sm:space-y-4 text-center"
          >
            <Link to="/" className="inline-block group">
              <img
                src="/blacklogo.png"
                alt="Arboreal Resort"
                className="h-12 sm:h-14 md:h-16 lg:h-16 w-auto drop-shadow-sm transition-all duration-500 group-hover:scale-105 mx-auto"
              />
            </Link>
            <p className="text-gray-600 font-light text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-4">
              Escape to tranquility. Experience luxury amidst nature at Arboreal
              Resort, where every moment is a celebration of serenity and
              elegance.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-2.5 justify-center">
              <a
                href="https://www.facebook.com/people/The-Arboreal-Resort/100083284368649/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiFacebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/arborealresort/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiInstagram className="w-4 h-4" />
              </a>
              {/* <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiTwitter className="w-4 h-4" />
              </a> */}
              <a
                href="https://www.youtube.com/@thearborealresort"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiYoutube className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Links & Contact - Compact 3 Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
            {/* Quick Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-gray-800 text-left">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-left">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-light text-xs sm:text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Explore */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h3 className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-gray-800 text-left">
                Explore
              </h3>
              <ul className="space-y-2.5 text-left">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-light text-xs sm:text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact (Real details) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <h3 className="text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-gray-800 text-left">
                Contact
              </h3>
              <div className="flex flex-col items-start text-left gap-3">
                <a
                  href="https://maps.app.goo.gl/2EL8NXUZgh4An2NL8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-light"
                >
                  <FiMapPin className="w-4 h-4" />
                  <span className="max-w-xs">
                    The Arboreal, Pvt. Road, Gevhande Apati, Lonavala, Maharashtra 412108
                  </span>
                </a>
                <div className="flex flex-col items-start gap-1">
                  <a href="tel:+918380035320" className="inline-flex items-start gap-2 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-light">
                    <FiPhone className="w-4 h-4" />
                    +918380035320
                  </a>
                 
                </div>
                <a href="mailto:reservations@thearborealresort.com" className="inline-flex items-start gap-2 text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-light">
                  <FiMail className="w-4 h-4" />
                  reservations@thearborealresort.com
                </a>
                <p className="text-[10px] text-gray-500">24/7 Reception</p>
              </div>
            </motion.div>
          </div>

          {/* Old Contact block hidden to avoid duplicate vertical space */}
          <motion.div className="hidden"></motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="pt-6 sm:pt-7 md:pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs text-gray-500 font-light text-center md:text-left">
              © {new Date().getFullYear()} Arboreal Resort. All rights reserved.
              Crafted with love.
            </p>
            {/* <div className="flex items-center gap-4 sm:gap-6 text-xs flex-wrap justify-center">
              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-light"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/terms"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-light"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <Link
                to="/sitemap"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-300 font-light"
              >
                Sitemap
              </Link>
            </div> */}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;