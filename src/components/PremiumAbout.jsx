import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useHomeSettings } from "../hooks/useHomeSettings";

const FALLBACK_TOP_IMAGE =
  "https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/accommodation/ac2";
const FALLBACK_BOTTOM_IMAGE =
  "https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/accommodation/ac";

const PremiumAbout = () => {
  const containerRef = useRef(null);
  const { settings } = useHomeSettings();

  const accommodations = settings?.accommodations;
  const topImage =
    accommodations?.[0]?.imageUrl ?? FALLBACK_TOP_IMAGE;
  const bottomImage =
    accommodations?.[1]?.imageUrl ?? FALLBACK_BOTTOM_IMAGE;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Center-focused parallax - images align perfectly when section is centered
  // Then diverge smoothly as you scroll away
  const topImageY = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.5, 0.65, 1], 
    [80, 20, 0, -20, -80]
  );
  
  const bottomImageY = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.5, 0.65, 1], 
    [-60, -15, 0, 15, 60]
  );
  
  // Subtle text fade optimized for center view
  const textOpacity = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.5, 0.7, 1], 
    [0.5, 1, 1, 1, 0.7]
  );
  
  const textY = useTransform(
    scrollYProgress, 
    [0, 0.3, 0.5, 0.7, 1], 
    [40, 10, 0, -5, -30]
  );

  // Enhanced scale for depth
  const topImageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.98, 1, 1.02]
  );
  
  const bottomImageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.02, 1, 0.98]
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#f5f3ed] overflow-hidden py-12 sm:py-16 lg:py-14 xl:py-16"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 xl:gap-24 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            className="space-y-4 sm:space-y-5 lg:space-y-8 z-10 order-2 lg:order-1"
            style={{ opacity: textOpacity, y: textY }}
          >
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gray-600 font-normal"
            >
              Accommodations
            </motion.p>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-tight font-normal"
              style={{ letterSpacing: "0.02em" }}
            >
              Find yourself here
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 lg:mb-8 max-w-xl font-normal"
            >
              Our elevated structures bring you to the treetops of the valley, offering an unparalleled experience akin to the best tree house in Lonavala. With the lush green rainforest as your backdrop, the view is truly mesmerizing and calming.
            </motion.p>

            {/* CTA Row - side by side on all screens (flex-nowrap keeps them on one line on phone) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-row flex-nowrap items-center gap-3 sm:gap-6 lg:gap-8 pt-2"
            >
            <Link to="/rooms">
              <motion.button
                className="group relative flex-shrink-0 px-4 sm:px-8 py-2.5 sm:py-3 bg-[#1a1a1a] text-white font-medium text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase overflow-hidden rounded-full whitespace-nowrap text-center"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="relative z-10">view all accommodations</span>
                <motion.div
                  className="absolute inset-0 bg-[#2a2a1a]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.button>
            </Link>
              <Link
                to="/booking"
                className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-4 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white whitespace-nowrap hover:bg-[#000000] transition-all duration-300 shadow-sm"
              >
                Book Your Stay
              </Link>
            </motion.div>

            {/* Scroll indicator inspired by hero section - directly below buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="pointer-events-none mt-6 flex flex-col items-center lg:items-start gap-2"
            >
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-gray-700/80 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-normal"
              >
                Scroll to Explore
              </motion.p>
              <div
                className="relative flex flex-col items-center"
                style={{ width: "1px", height: "56px" }}
              >
                {/* Static vertical line */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#1a1a1a]/50 via-[#1a1a1a]/30 to-transparent" />

                {/* Bouncing dot */}
                <motion.div
                  style={{ position: "absolute", bottom: 0, left: "50%", x: "-50%" }}
                  animate={{ y: [0, 10] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    type: "spring",
                    stiffness: 200,
                    damping: 16,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "8px",
                      height: "8px",
                      transform: "translate(-50%, -50%)",
                      background: "#1a1a1a",
                      borderRadius: "9999px",
                      boxShadow: "0 0 6px rgba(0,0,0,0.45)",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Images: stacked on mobile, overlapping on desktop */}
          <div className="relative h-[320px] sm:h-[400px] md:h-[480px] lg:h-[650px] xl:h-[700px] order-1 lg:order-2">
            {/* Top Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-[78%] sm:w-[75%] h-[48%] sm:h-[52%] overflow-hidden rounded-lg sm:rounded-none shadow-2xl"
              style={{ 
                y: topImageY,
                scale: topImageScale,
                willChange: 'transform'
              }}
            >
              <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xs sm:text-sm tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/90 mb-0.5 sm:mb-1 font-normal"
                  style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  BY NATURE
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-white leading-tight font-normal"
                  style={{ 
                    letterSpacing: "0.02em",
                    textShadow: "0 4px 20px rgba(0,0,0,0.5)"
                  }}
                >
                  The Tree-House Resort
                </motion.h3>
              </div>
              <motion.img
                src={topImage}
                alt="Tropical coconuts"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />
            </motion.div>

            {/* Bottom Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 w-[72%] sm:w-[70%] h-[48%] sm:h-[52%] overflow-hidden rounded-lg sm:rounded-none shadow-2xl"
              style={{ 
                y: bottomImageY,
                scale: bottomImageScale,
                willChange: 'transform'
              }}
            >
              <motion.img
                src={bottomImage}
                alt="Luxury resort experience"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A0826D]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A0826D]/15 to-transparent" />
    </section>
  );
};

export default PremiumAbout;