import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Lightbox = ({ images, currentIndex, onClose, onNext, onPrev }) => {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    // Save current scroll position (using Lenis if available, otherwise native)
    let lenisInstance = null;
    if (window.lenis) {
      lenisInstance = window.lenis;
      scrollPositionRef.current = lenisInstance.scroll;
      // Stop Lenis smooth scrolling
      lenisInstance.stop();
    } else {
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;
    }

    // Prevent body scroll
    const body = document.body;
    const html = document.documentElement;
    
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;
    const originalHtmlOverflow = html.style.overflow;

    // Lock scroll
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.width = '100%';
    html.style.overflow = 'hidden';

    // Hide navbar when lightbox is open
    const navbar = document.querySelector('header');
    if (navbar) {
      navbar.style.display = 'none';
    }

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Restore scroll
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      html.style.overflow = originalHtmlOverflow;
      
      // Restore Lenis or native scroll
      if (lenisInstance) {
        lenisInstance.start();
        lenisInstance.scrollTo(scrollPositionRef.current, { immediate: false });
      } else {
        window.scrollTo(0, scrollPositionRef.current);
      }
      
      // Show navbar again when lightbox closes
      if (navbar) {
        navbar.style.display = '';
      }
      
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  if (currentIndex === null || currentIndex < 0) return null;

  // SSR safety - don't render if document is not available
  if (typeof document === 'undefined') return null;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } },
  };

  // Render lightbox via portal to document.body to escape Lenis transform context
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 flex items-center justify-center"
        style={{ 
          zIndex: 10020, // Higher than navbar (9999) and mobile menu (10001)
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          className="fixed top-4 right-4 sm:top-6 sm:right-6 text-white p-3 sm:p-4 rounded-full bg-black/90 hover:bg-black transition-all duration-300 backdrop-blur-sm shadow-2xl border-2 border-white/40 z-[10021]"
          style={{ zIndex: 10021 }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close lightbox"
        >
          <FiX className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Desktop Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="fixed left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 text-white p-3 sm:p-4 rounded-full bg-black/80 hover:bg-black/95 transition-all duration-300 backdrop-blur-sm shadow-2xl border-2 border-white/40 z-[10021] hidden md:flex items-center justify-center"
              style={{ zIndex: 10021 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
            <button
              className="fixed right-4 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 text-white p-3 sm:p-4 rounded-full bg-black/80 hover:bg-black/95 transition-all duration-300 backdrop-blur-sm shadow-2xl border-2 border-white/40 z-[10021] hidden md:flex items-center justify-center"
              style={{ zIndex: 10021 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          </>
        )}

        {/* Image Display - Perfectly Centered */}
        <div
          className="relative w-full h-full flex items-center justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] sm:max-w-[85vw] w-auto h-auto object-contain"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
          </AnimatePresence>
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div
            className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white text-sm sm:text-base bg-black/90 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-sm border-2 border-white/40 shadow-2xl z-[10021]"
            style={{ zIndex: 10021 }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Mobile Navigation Arrows */}
        {images.length > 1 && (
          <div
            className="md:hidden fixed bottom-16 sm:bottom-20 left-0 right-0 flex justify-center items-center gap-4 z-[10021]"
            style={{ zIndex: 10021 }}
          >
            <button
              className="text-white p-3 rounded-full bg-black/90 hover:bg-black transition-all duration-300 backdrop-blur-sm shadow-2xl border-2 border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous image"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="text-white p-3 rounded-full bg-black/90 hover:bg-black transition-all duration-300 backdrop-blur-sm shadow-2xl border-2 border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next image"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Lightbox;
