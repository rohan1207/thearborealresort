import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── Room sub-links for dropdown & sidebar ──
const rooms = [
  { label: "Forest Private Pool", slug: "forest-private-pool" },
  { label: "Luxury Sunroom", slug: "luxury-sunroom" },
  { label: "Forest Bathtub", slug: "forest-bathtub" },
  { label: "Classic Sunroom", slug: "classic-sunroom" },
];

// ── NEW: flat nav links used in the secondary strip ──
const stripLinks = [
  { to: "/",        label: "Home",      end: true },
  { to: "/rooms",   label: "Our Rooms", hasDropdown: true },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog",    label: "Our Blogs" },
  { to: "/about",   label: "About Us" },
  { to: "/contact", label: "Contact Us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ── NEW: rooms hover state ──
  const [roomsHovered, setRoomsHovered] = useState(false);
  const hoverTimer = useRef(null);
  const handleRoomsEnter = () => { clearTimeout(hoverTimer.current); setRoomsHovered(true); };
  const handleRoomsLeave = () => { hoverTimer.current = setTimeout(() => setRoomsHovered(false), 150); };

  // ── ORIGINAL scroll detection (100% unchanged) ──
  useEffect(() => {
    const handleLenisScroll = ({ scroll, limit, velocity, direction, progress }) => {
      setIsScrolled(scroll > 50);
    };
    const handleNativeScroll = () => { setIsScrolled(window.scrollY > 50); };

    let checkInterval;
    let cleanup;

    const checkLenis = () => {
      if (window.lenis) {
        window.lenis.on('scroll', handleLenisScroll);
        setIsScrolled(window.lenis.scroll > 50);
        if (checkInterval) { clearInterval(checkInterval); checkInterval = null; }
        return () => { if (window.lenis) window.lenis.off('scroll', handleLenisScroll); };
      }
      return null;
    };

    cleanup = checkLenis();

    if (!cleanup) {
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
      checkInterval = setInterval(() => {
        const newCleanup = checkLenis();
        if (newCleanup) {
          cleanup = newCleanup;
          window.removeEventListener("scroll", handleNativeScroll);
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }, 100);
    }

    return () => {
      if (cleanup) cleanup();
      if (checkInterval) clearInterval(checkInterval);
      window.removeEventListener("scroll", handleNativeScroll);
    };
  }, []);

  // ── ORIGINAL animation variants (100% unchanged) ──
  const mobileMenuVariants = {
    hidden:  { opacity: 0, x: "-100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit:    { opacity: 0, x: "-100%", transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const backdropVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit:    { opacity: 0, transition: { duration: 0.3 } },
  };

  const linkVariants = {
    hidden:  { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 + 0.2, duration: 0.5, ease: "easeOut" } }),
  };

  const navbarContent = (
    <>
      <style>{`
        .navbar-always-visible {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          z-index: 9999 !important;
          transform: translateZ(0) !important;
          will-change: auto !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* ── NEW: strip hover underline ── */
        .strip-link {
          position: relative;
        }
        .strip-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%; right: 50%;
          height: 1px;
          background: currentColor;
          transition: left 0.35s cubic-bezier(0.25,0.46,0.45,0.94),
                      right 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
          opacity: 0.4;
        }
        .strip-link:hover::after,
        .strip-link-active::after {
          left: 0 !important; right: 0 !important;
        }

        /* ── NEW: hide strip on phones ── */
        @media (max-width: 639px) {
          .nav-secondary-strip { display: none !important; }
        }
      `}</style>

      {/* ── ORIGINAL header — bg, rounded, everything identical ── */}
      <header
        className={`navbar-always-visible transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-[#2a2a2a]/95 backdrop-blur-md shadow-2xl"
            : "bg-transparent backdrop-blur-none shadow-none"
        }`}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          width: '100%', zIndex: 9999, display: 'block', visibility: 'visible',
        }}
      >
        {/* ── ORIGINAL primary nav (100% unchanged) ── */}
        <nav className="container mx-auto px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-700 ease-in-out ${
              isScrolled ? "h-[70px] lg:h-[94px]" : "h-20 lg:h-28"
            }`}
          >

            {/* Left: Hamburger + Menu label */}
            <div className="flex items-center gap-4 lg:gap-6">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-col justify-center items-center w-8 h-8 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`w-6 h-0.5 rounded-full transition-all duration-700 ${isScrolled ? "bg-white" : "bg-black"} group-hover:bg-gray-400`}
                  animate={isOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className={`w-6 h-0.5 rounded-full mt-1.5 transition-all duration-700 ${isScrolled ? "bg-white" : "bg-black"} group-hover:bg-gray-400`}
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className={`w-6 h-0.5 rounded-full mt-1.5 transition-all duration-700 ${isScrolled ? "bg-white" : "bg-black"} group-hover:bg-gray-400`}
                  animate={isOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <button
                onClick={() => setIsOpen(true)}
                className={`hidden sm:block text-[15px] lg:text-[16px] font-medium tracking-normal transition-all duration-700 ${
                  isScrolled ? "text-white" : "text-black"
                } hover:text-gray-500`}
              >
                Menu
              </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link to="/home">
                <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
                  <img
                    src={isScrolled ? "/logo.png" : "/blacklogo.png"}
                    alt="Arboreal Resort"
                    className={`w-auto object-contain transition-all duration-700 ease-in-out ${
                      isScrolled ? "h-[56px] lg:h-[84px]" : "h-16 lg:h-24"
                    }`}
                  />
                </motion.div>
              </Link>
            </div>

            {/* Right: Book Now Button */}
            <div className="flex items-center">
              <Link
                to="/booking"
                className={`px-3 lg:px-6 py-2 lg:py-2 text-sm rounded-full lg:text-base font-semibold transition-all duration-700 ${
                  isScrolled
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                } hover:shadow-xl transform hover:scale-105`}
              >
                Reserve
              </Link>
            </div>
          </div>
        </nav>

        {/* ── NEW: secondary strip below primary bar — hidden on mobile ── */}
        <div
          className={`nav-secondary-strip border-t transition-colors duration-700 ${
            isScrolled ? "border-white/10" : "border-black/10"
          }`}
        >
          <div className="w-full">
            <div className="relative">
              <div className="flex items-center justify-center gap-8 lg:gap-14 h-9 lg:h-10">
              {stripLinks.map((link) =>
                link.hasDropdown ? (
                  /* Our Rooms — hover reveals room ribbon */
                  <div
                    key={link.to}
                    className="relative flex items-center h-full"
                    onMouseEnter={handleRoomsEnter}
                    onMouseLeave={handleRoomsLeave}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `strip-link flex items-center gap-1 text-[11px] lg:text-[12px] tracking-widest uppercase font-medium whitespace-nowrap transition-colors duration-500 ${
                          isScrolled ? "text-white/65 hover:text-white" : "text-black/55 hover:text-black"
                        } ${isActive ? "strip-link-active" : ""}`
                      }
                    >
                      {link.label}
                      <motion.svg
                        className="w-[9px] h-[9px] opacity-50"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        animate={{ rotate: roomsHovered ? 180 : 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </NavLink>

                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `strip-link text-[11px] lg:text-[12px] tracking-widest uppercase font-medium whitespace-nowrap transition-colors duration-500 ${
                        isScrolled ? "text-white/65 hover:text-white" : "text-black/55 hover:text-black"
                      } ${isActive ? "strip-link-active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
              </div>

              {/* Rooms dropdown - full-width strip attached below secondary strip */}
              <AnimatePresence>
                {roomsHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute top-full left-0 right-0 z-[10002] h-9 lg:h-10 flex items-center justify-center border-t whitespace-nowrap ${
                      isScrolled
                        ? "bg-[#2a2a2a]/95 backdrop-blur-md border-white/10"
                        : "bg-transparent border-black/10"
                    }`}
                    onMouseEnter={handleRoomsEnter}
                    onMouseLeave={handleRoomsLeave}
                  >
                    <div className="flex items-center gap-2 lg:gap-3 px-4 lg:px-8 overflow-x-auto scrollbar-hide">
                      {rooms.map((room, i) => (
                        <motion.div
                          key={room.slug}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.2 }}
                        >
                          <Link
                            to="/rooms"
                            state={{ selectedRoomSlug: room.slug }}
                            className={`inline-flex items-center px-2 lg:px-3 py-0 text-[11px] lg:text-[12px] tracking-widest uppercase font-medium transition-all duration-300 ${
                              isScrolled
                                ? "text-white/65 hover:text-white"
                                : "text-black/55 hover:text-black"
                            }`}
                          >
                            {room.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ── ORIGINAL Mobile Sidebar (unchanged except rooms sub-links added) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000]"
              onClick={() => setIsOpen(false)}
              style={{ zIndex: 10000 }}
            />

            {/* Sidebar */}
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 left-0 h-full w-80 lg:w-96 bg-white z-[10001] shadow-2xl"
              style={{ zIndex: 10001 }}
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                <Link to="/home" onClick={() => setIsOpen(false)}>
                  <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
                    <img src="/blacklogo.png" alt="Swaranjali Resort" className="h-10 lg:h-16 w-auto" />
                  </motion.div>
                </Link>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="px-8 py-6 flex-1">
                <div className="space-y-1">
                  {[
                    { to: "/",        label: "Home" },
                    { to: "/rooms",   label: "Our Rooms", hasDropdown: true },
                    { to: "/gallery", label: "Gallery" },
                    { to: "/blog",    label: "Our Blogs" },
                    { to: "/about",   label: "About Us" },
                    { to: "/contact", label: "Contact US" },
                  ].map((link, i) => (
                    <motion.div key={link.to} custom={i} variants={linkVariants} initial="hidden" animate="visible">
                      <NavLink to={link.to} onClick={() => setIsOpen(false)}>
                        {({ isActive }) => (
                          <span
                            className={`block px-6 py-4 text-lg font-light tracking-wide transition-all duration-300 rounded-md group ${
                              isActive
                                ? "bg-gray-50 text-gray-600 border-l-4 border-gray-500"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-2"
                            }`}
                          >
                            <span className="flex items-center justify-between">
                              {link.label}
                              <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isActive ? "text-gray-500" : "text-gray-400 group-hover:translate-x-1"
                                }`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </span>
                        )}
                      </NavLink>

                      {/* ── NEW: room sub-links in sidebar under "Our Rooms" ── */}
                      {link.hasDropdown && (
                        <div className="pl-4 pt-0 pb-1">
                          {rooms.map((room, ri) => (
                            <motion.div
                              key={room.slug}
                              custom={ri + i + 1}
                              variants={linkVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <Link
                                to="/rooms"
                                state={{ selectedRoomSlug: room.slug }}
                                onClick={() => setIsOpen(false)}
                                className="block px-6 py-2 text-lg font-light tracking-wide text-black hover:text-black/80 transition-all duration-300 hover:translate-x-1"
                              >
                                {room.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer — ORIGINAL unchanged */}
              <motion.div
                variants={linkVariants}
                custom={8}
                initial="hidden"
                animate="visible"
                className="px-8 py-6 border-t border-gray-100"
              >
                <div className="flex justify-center space-x-8">
                  <motion.a
                    href="https://www.facebook.com/people/The-Arboreal-Resort/100083284368649/"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    href="https://www.instagram.com/arborealresort/"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  return typeof document !== 'undefined'
    ? createPortal(navbarContent, document.body)
    : navbarContent;
};

export default Navbar;