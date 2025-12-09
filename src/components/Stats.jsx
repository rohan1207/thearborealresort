import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const images = [
  "/swaranjali1.png",
  "/swaranjali2.jpg",
  "/swaranjali3.jpg",
  "/swaranjali4.png",
];

const stats = [
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Happy Clients" },
  { value: "30+", label: "Luxury Rooms" },
];

const Stats = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl lg:text-5xl font-light text-gray-800 leading-tight">
            Luxury{" "}
            <span className="font-serif text-[#6D2C2C] italic">
              Accommodation
            </span>
          </h2>
          <h3 className="text-2xl lg:text-3xl font-light text-gray-500 mt-2 mb-6">
            with impeccable service
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Experience the perfect blend of luxury and comfort. Our premium
            accommodations offer unparalleled service and attention to detail
            that will make your stay unforgettable.
          </p>

          <div className="flex flex-wrap gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-[#6D2C2C]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 tracking-wider mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Image Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-square w-full max-w-lg mx-auto shadow-2xl rounded-md overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt="Luxury accommodation"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Slider Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white transition-all p-2 rounded-full text-gray-800 z-10"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white transition-all p-2 rounded-full text-gray-800 z-10"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Bottom Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentImage === index ? "bg-white scale-125" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
