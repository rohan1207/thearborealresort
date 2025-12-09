import React from "react";
import { motion } from "framer-motion";

const images = [
  {
    src: "/swaranjali2.jpg",
    alt: "Poolside luxury",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/swaranjali12.png",
    alt: "Elegant dining",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/swaranjali4.png",
    alt: "Royal suite",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/swaranjali5.png",
    alt: "Grand lobby",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/swaranjali6.avif",
    alt: "Garden view",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/swaranjali7.avif",
    alt: "Luxury spa",
    span: "col-span-1 row-span-1",
  },
];

const BentoGallery = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#6D2C2C] mb-2 tracking-tight">
            Moments at Swaranjali
          </h2>
          <p className="text-lg md:text-xl text-stone-700 font-light max-w-2xl mx-auto">
            See the elegance before you experience it.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-4 rounded-md overflow-hidden">
          {images.map((img, idx) => (
            <motion.div
              key={img.src}
              className={`relative group bg-stone-100 overflow-hidden rounded-md shadow-sm ${img.span}`}
              whileHover={{ scale: 1.025 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 group-hover:brightness-95"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full bg-[#6D2C2C] text-white font-semibold shadow-lg hover:bg-[#4d1e1e] transition-colors text-lg tracking-wide"
          >
            View All
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BentoGallery;
