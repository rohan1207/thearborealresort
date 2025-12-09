import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  if (currentIndex === null || currentIndex < 0) return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[120] backdrop-blur-sm p-4 pt-28"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl z-50 p-3 rounded-full bg-black/50 hover:bg-black/80 transition-all duration-300 shadow-lg border border-white/20 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <FiX className="w-6 h-6" />
      </button>

      {/* Desktop-only side arrows */}
      {images.length > 1 && (
        <>
          <button
            className="hidden sm:flex absolute left-4 sm:left-10 text-white text-4xl z-50 p-3 rounded-full bg-black/30 hover:bg-black/60 transition-colors items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <FiChevronLeft />
          </button>
          <button
            className="hidden sm:flex absolute right-4 sm:right-10 text-white text-4xl z-50 p-3 rounded-full bg-black/30 hover:bg-black/60 transition-colors items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <FiChevronRight />
          </button>
        </>
      )}

      {/* Image Display */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Project gallery image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain shadow-2xl rounded-md"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Mobile-only bottom arrows */}
      {images.length > 1 && (
        <div className="sm:hidden flex justify-center items-center gap-8 mt-4">
          <button
            className="text-white text-4xl z-50 p-3 rounded-full bg-black/30 hover:bg-black/60 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <FiChevronLeft />
          </button>
          <button
            className="text-white text-4xl z-50 p-3 rounded-full bg-black/30 hover:bg-black/60 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Lightbox;
