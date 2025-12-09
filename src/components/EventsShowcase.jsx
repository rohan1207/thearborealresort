import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const eventTypes = [
  {
    name: "Birthday Events",
    image: "/swaranjali5.png",
    description: "Elegant and joyful birthday celebrations tailored to you.",
  },
  {
    name: "Wedding Events",
    image: "/swaranjali6.avif",
    description:
      "Create timeless memories with our exquisite wedding services.",
  },
  {
    name: "Corporate Events",
    image: "/swaranjali7.avif",
    description:
      "Professional and sophisticated settings for your business gatherings.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const panelVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.2 + 0.5,
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

const EventsShowcase = () => {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            variants={textVariants}
            className="text-4xl lg:text-5xl font-light text-gray-800 leading-tight"
          >
            Turning your celebrations into{" "}
            <span className="font-serif text-[#6D2C2C] italic">
              cherished memories.
            </span>
          </motion.h2>
          <motion.p
            variants={textVariants}
            className="mt-6 text-lg text-gray-600 leading-relaxed"
          >
            We go beyond just great service — offering premium-grade food and
            thoughtful amenities to make every event truly unforgettable.
          </motion.p>
        </motion.div>

        {/* Event Panels */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {eventTypes.map((event, i) => (
            <motion.div
              key={event.name}
              custom={i}
              variants={panelVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.5 }}
              className="group relative h-48 sm:h-64 md:h-96 rounded-md overflow-hidden shadow-lg"
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out"
                style={{ backgroundImage: `url(${event.image})` }}
                whileHover={{ scale: 1.1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3 sm:p-4 md:p-6 text-white">
                <h3 className="text-sm sm:text-lg md:text-2xl font-semibold tracking-wide leading-tight">
                  {event.name}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link to="/services">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#6D2C2C] text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition-all"
            >
              View All Services
              <FiArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsShowcase;
