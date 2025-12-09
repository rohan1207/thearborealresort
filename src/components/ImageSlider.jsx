import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const containerRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const resizeTimeoutRef = useRef(null);

  const images = [
    { src: '/slider5.webp', alt: 'Resort view 5' },
    { src: '/slider6.webp', alt: 'Resort view 6' },
    { src: '/slider7.webp', alt: 'Resort view 7' },
    { src: '/slider8.webp', alt: 'Resort view 8' },
    { src: '/slider9.webp', alt: 'Resort view 9' },
    { src: '/slider10.webp', alt: 'Resort view 10' },
    { src: '/slider11.webp', alt: 'Resort view 11' },
    { src: '/slider12.webp', alt: 'Resort view 12' },
    { src: '/slider13.webp', alt: 'Resort view 13' },
    { src: '/slider14.webp', alt: 'Resort view 14' },
    { src: '/slider15.webp', alt: 'Resort view 15' },
    { src: '/slider16.webp', alt: 'Resort view 16' },
    { src: '/slider17.webp', alt: 'Resort view 17' },
    { src: '/slider18.webp', alt: 'Resort view 18' },
    { src: '/slider19.webp', alt: 'Resort view 19' },
    { src: '/slider20.webp', alt: 'Resort view 20' },
    { src: '/slider21.webp', alt: 'Resort view 21' },
    { src: '/slider22.webp', alt: 'Resort view 22' },
    { src: '/slider23.webp', alt: 'Resort view 23' },
    { src: '/slider24.webp', alt: 'Resort view 24' },
    { src: '/slider25.webp', alt: 'Resort view 25' },
    { src: '/slider26.webp', alt: 'Resort view 26' },
  ];

  // Debounced dimension update
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setTotalWidth(containerRef.current.scrollWidth);
      setViewportWidth(window.innerWidth);
    }
  }, []);

  // Calculate dimensions with debounced resize
  useEffect(() => {
    updateDimensions();
    
    const handleResize = () => {
      // Clear existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      // Debounce resize events
      resizeTimeoutRef.current = setTimeout(() => {
        updateDimensions();
      }, 150); // 150ms debounce
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    // Recalculate after initial images load
    const timer = setTimeout(updateDimensions, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [updateDimensions]);

  // Auto-scroll with pause-drag effect - optimized
  useEffect(() => {
    if (totalWidth === 0 || viewportWidth === 0) return;

    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        const maxScroll = totalWidth - viewportWidth;
        const scrollAmount = 400; // Move by 400px each time
        const nextPosition = prev + scrollAmount;
        
        // Only loop back when we've actually reached the end
        if (nextPosition >= maxScroll) {
          return 0; // Loop back to start
        }
        return nextPosition;
      });
    }, 3000); // 3 second pause

    return () => clearInterval(interval);
  }, [totalWidth, viewportWidth]);

  // Memoize image size calculations
  const getImageClass = useCallback((index) => {
    const sizePattern = index % 4;
    switch(sizePattern) {
      case 0: // Small horizontal
        return 'h-[180px] sm:h-[220px] w-[240px] sm:w-[300px]';
      case 1: // Large horizontal
        return 'h-[250px] sm:h-[300px] w-[320px] sm:w-[400px]';
      case 2: // Medium vertical
        return 'h-[280px] sm:h-[330px] w-[200px] sm:w-[250px]';
      case 3: // Tall vertical
        return 'h-[320px] sm:h-[380px] w-[220px] sm:w-[280px]';
      default:
        return 'h-[250px] sm:h-[300px] w-[320px] sm:w-[400px]';
    }
  }, []);

  // Handle image load with debouncing
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    
    // Debounce dimension recalculation
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        setTotalWidth(containerRef.current.scrollWidth);
      }
    }, 100);
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentPosition(prev => Math.max(0, prev - 400));
  }, []);

  const handleNext = useCallback(() => {
    const maxScroll = totalWidth - viewportWidth;
    setCurrentPosition(prev => {
      const nextPos = prev + 400;
      return nextPos >= maxScroll ? maxScroll : nextPos;
    });
  }, [totalWidth, viewportWidth]);

  return (
    <div className="relative w-full bg-[#f5f3ed] py-8 sm:py-12">
      {/* Text Content */}
      <div className="max-w-3xl text-gray-700 mx-auto px-4 sm:px-8 mb-8 sm:mb-12 text-center">
        <h4>LONAVALA</h4>
        <h2 className="text-2xl text-gray-700 mb-4">The Arboreal Resort</h2>
        <p className="text-gray-700 leading-relaxed text-center">
        Tucked away in the untouched forests of the Western Ghats, The Arboreal Resort is an eco-luxury retreat overlooking the serene Pawna Lake. From its elevated, treehouse-inspired setting, the resort offers sweeping valley views, handcrafted wooden interiors, and quiet spaces designed for calm and connection. With forest trails, hidden waterfalls and curated nature experiences, Arboreal invites you to slow down, immerse yourself in the wilderness, and rediscover the beauty of being close to nature.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Previous images"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Next images"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Images Wrapper */}
        <div className="overflow-hidden">
          <div
            ref={containerRef}
            className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translate3d(-${currentPosition}px, 0, 0)`,
              willChange: 'transform'
            }}
          >
            {images.map((image, index) => {
              const imageClass = getImageClass(index);
              
              return (
                <div
                  key={index}
                  className="flex-shrink-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={index < 6 ? "eager" : "lazy"}
                    decoding="async"
                    className={`${imageClass} object-cover rounded-lg shadow-xl`}
                    style={{ 
                      willChange: 'auto'
                    }}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(images.length / 2) }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentPosition / 400) === index
                ? 'w-8 bg-gray-800'
                : 'w-2 bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;