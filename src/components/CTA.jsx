import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Phone, Trees, Mountain, Leaf, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const SecondSection = () => {
  const features = [
    {
      Icon: Trees,
      title: "Nature Immersion",
      subtitle: "Elevated tree-house structures nestled in lush rainforest canopies",
    },
    {
      Icon: Mountain,
      title: "Valley Views",
      subtitle: "Breathtaking panoramic vistas of the valley from treetop heights",
    },
    {
      Icon: Leaf,
      title: "Eco-Conscious",
      subtitle: "Sustainable practices that honor and preserve the natural environment",
    },
    {
      Icon: Waves,
      title: "Tranquil Escape",
      subtitle: "A serene sanctuary where nature meets luxury in perfect harmony",
    },
  ];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 50, damping: 40, restDelta: 0.001 };

  // Main image zoom effect - starts zoomed in, zooms out as you scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 0.95]);
  const smoothScale = useSpring(scale, springConfig);

  // Floating decorative image - moves up
  const yFloating1 = useTransform(scrollYProgress, [0, 1], [50, -100]);
  const rotateFloating1 = useTransform(scrollYProgress, [0, 1], [0, -25]);
  const smoothYFloating1 = useSpring(yFloating1, springConfig);
  const smoothRotateFloating1 = useSpring(rotateFloating1, springConfig);

  // Floating decorative image - moves down
  const yFloating2 = useTransform(scrollYProgress, [0, 1], [-50, 100]);
  const rotateFloating2 = useTransform(scrollYProgress, [0, 1], [0, 25]);
  const smoothYFloating2 = useSpring(yFloating2, springConfig);
  const smoothRotateFloating2 = useSpring(rotateFloating2, springConfig);

  return (
    <section
      ref={targetRef}
      className="relative bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] py-10 sm:py-16 lg:py-20 px-4 sm:px-8 overflow-hidden min-h-0 sm:min-h-screen"
    >
      {/* Background Text - larger on phone for impact, scales up on larger screens */}
      <motion.div
        className="absolute top-4 sm:top-0 left-0 right-0 text-center text-[16vw] sm:text-[14vw] lg:text-[16vw] font-playfair font-black text-[#A0826D]/10 whitespace-nowrap z-0 leading-none select-none pointer-events-none"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ letterSpacing: "0.1em" }}
      >
        ARBOREAL
      </motion.div>

      {/* Main Layout Container - tighter on mobile, no excess top space */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto pt-8 sm:pt-16 lg:pt-32 mt-8 sm:mt-16 lg:mt-20">
        {/* Left Side - Resort Images (order-2 on mobile) */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center order-2 lg:order-1 mt-8 sm:mt-12 lg:mt-0">
          {/* Main resort image in center */}
          <motion.div
            className="relative z-20 w-[85%] sm:w-[65%] lg:w-[90%]"
            style={{ scale: smoothScale }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="/slider5.webp"
              alt="The Arboreal Resort - Tree House Experience"
              className="w-full h-full object-cover rounded-md drop-shadow-2xl"
              loading="lazy"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </div>

        {/* Right Side - Text Content (order-1 on mobile) - left-aligned on all screens for hierarchy */}
        <div className="w-full lg:w-1/2 lg:pl-16 order-1 lg:order-2 text-left px-0 sm:px-0">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-lg mx-0"
          >
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-normal text-[#1a1a1a] leading-tight mb-4 sm:mb-6 z-40"
              style={{ letterSpacing: "0.02em" }}
            >
              ELEVATED
              <br />
              BY NATURE
            </h2>

            <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-light">
              Surrounded by lush greenery and untouched landscapes, Arboreal Resort offers a stay rooted in nature. A peaceful escape designed for those who seek silence, beauty, and balance.
            </p>

            {/* CTA row: side-by-side on all screens - premium, clean, neat */}
            <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-6 lg:gap-10">
              <Link
                to="/booking"
                className="bg-[#1a1a1a] text-white px-5 sm:px-8 py-3 sm:py-4 text-[11px] sm:text-xs font-light tracking-[0.18em] sm:tracking-[0.2em] uppercase rounded-full hover:bg-[#2a2a2a] transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg"
              >
              Reserve
              </Link>
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-[#A0826D]/10 rounded-full flex items-center justify-center flex-shrink-0"
                  whileHover={{ scale: 1.08, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Phone size={18} className="text-[#A0826D] sm:w-5 sm:h-5" />
                </motion.div>
                <span className="text-[#1a1a1a] font-light text-xs sm:text-base leading-tight">
                  Book Your <span className="text-[#A0826D]">Stay Today</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Decorative Images - hidden on very small to avoid overlap */}
      <motion.div
        className="absolute right-[-3%] top-[10%] w-20 h-20 sm:w-48 sm:h-48 lg:w-60 lg:h-60 z-30 hidden sm:block"
        style={{ y: smoothYFloating1, rotate: smoothRotateFloating1 }}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img
          src="/arboreal2.png"
          alt="Nature view"
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <motion.div
        className="absolute left-[-3%] bottom-[15%] w-16 h-16 sm:w-40 sm:h-40 z-30 hidden sm:block"
        style={{ y: smoothYFloating2, rotate: smoothRotateFloating2 }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >

        <img
          src="/arboreal2.png"
          alt="Nature view"
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Features Ribbon - less top margin on mobile */}
      <div className="relative z-20 mt-12 sm:mt-24 lg:mt-16 px-0">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 max-w-6xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 group"
              whileHover={{ scale: 1.02, y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#A0826D]/10 rounded-full flex items-center justify-center shadow-inner flex-shrink-0 group-hover:bg-[#A0826D]/20 transition-colors duration-500">
                <feature.Icon className="text-[#A0826D]" size={28} />
              </div>
              <div>
                <h3 className="font-light text-[#1a1a1a] tracking-wider text-sm sm:text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-[#6B6B6B] text-xs sm:text-sm font-light leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SecondSection;
