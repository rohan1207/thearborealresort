import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";

const MiniAboutUs = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold text-[#6D2C2C] tracking-wider mb-4">
              About Swaranjali Hotel & Lawns
            </p>
            <h2 className="text-4xl lg:text-5xl font-serif text-gray-800 leading-tight mb-6">
              Escape into elegance at Swaranjali — a luxury resort nestled in
              the heart of Maharashtra.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our design-first approach blends comfort with sustainability,
              offering thoughtfully curated spaces and services.Backed by a
              passionate team of hospitality professionals, Swaranjali delivers
              refined experiences through intelligent design, warmth, and
              attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-lg hover:bg-gray-900 transition-colors w-full sm:w-auto"
                >
                  About Us
                </motion.button>
              </Link>
              <a
                href="tel:1800222000"
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
              >
                <FiPhone />
                <span className="font-semibold">1 800 222 000</span>
              </a>
            </div>
          </motion.div>

          {/* Desktop Image Collage */}
          <div className="hidden lg:block relative h-[450px] mt-12 lg:mt-0">
            <motion.div
              className="absolute top-0 right-0 w-4/5 h-4/5"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src="/swaranjali9.avif"
                alt="Tropical Coconuts"
                className="w-full h-full object-cover rounded-md shadow-lg"
              />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 w-3/5 h-3/5"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <img
                src="/swaranjali8.avif"
                alt="Woman on beach"
                className="w-full h-full object-cover rounded-md shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Mobile/Tablet Image Layout */}
          <div className="lg:hidden mt-8 space-y-4">
            {/* Main Large Image */}
            <motion.div
              className="relative h-64 sm:h-80"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <img
                src="/swaranjali9.avif"
                alt="Tropical Coconuts"
                className="w-full h-full object-cover rounded-md shadow-lg"
              />
            </motion.div>

            {/* Secondary Smaller Image */}
            <motion.div
              className="relative h-40 sm:h-48 w-3/4 ml-auto"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <img
                src="/swaranjali8.avif"
                alt="Woman on beach"
                className="w-full h-full object-cover rounded-md shadow-xl"
              />
              
              {/* Decorative overlay for visual interest */}
              <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-br from-[#6D2C2C]/20 to-transparent rounded-md -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniAboutUs;
