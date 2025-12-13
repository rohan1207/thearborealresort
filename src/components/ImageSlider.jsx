import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const containerRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const resizeTimeoutRef = useRef(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Hardcoded Cloudinary URLs - Cloud name: dxevy8mea
  const cloudinaryImages = [
    { name: 'slider5', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider5' },
    { name: 'slider6', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider6' },
    { name: 'slider7', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider7' },
    { name: 'slider8', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider8' },
    { name: 'slider9', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider9' },
    { name: 'slider10', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider10' },
    { name: 'slider11', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider11' },
    { name: 'slider12', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider12' },
    { name: 'slider13', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider13' },
    { name: 'slider14', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider14' },
    { name: 'slider15', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider15' },
    { name: 'slider16', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider16' },
    { name: 'slider17', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider17' },
    { name: 'slider18', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider18' },
    { name: 'slider19', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider19' },
    { name: 'slider20', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider20' },
    { name: 'slider21', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider21' },
    { name: 'slider22', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider22' },
    { name: 'slider23', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider23' },
    { name: 'slider24', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider24' },
    { name: 'slider25', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider25' },
    { name: 'slider26', url: 'https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/slider/slider26' },
  ];

  // Use Cloudinary URLs - duplicate for infinite scroll
  const baseImages = cloudinaryImages.map((img, index) => ({
    src: img.url,
    alt: `Resort view ${index + 5}`
  }));
  
  // Duplicate images for seamless infinite scroll
  const images = [...baseImages, ...baseImages];

  // Debounced dimension update
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const total = containerRef.current.scrollWidth;
      setTotalWidth(total);
      setViewportWidth(window.innerWidth);
      // Calculate width of single set (half of total since we duplicate)
      setSingleSetWidth(total / 2);
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

  // Auto-scroll with infinite loop - seamless
  useEffect(() => {
    if (totalWidth === 0 || viewportWidth === 0 || singleSetWidth === 0) return;

    const interval = setInterval(() => {
      setCurrentPosition(prev => {
        const scrollAmount = 400; // Move by 400px each time
        let nextPosition = prev + scrollAmount;
        
        // When we've scrolled past the first set, reset to equivalent position in first set
        // This creates seamless infinite loop
        if (nextPosition >= singleSetWidth) {
          // Disable transition for instant reset
          setIsTransitioning(false);
          nextPosition = nextPosition - singleSetWidth;
          
          // Re-enable transition after a brief moment
          setTimeout(() => {
            setIsTransitioning(true);
          }, 50);
          
          return nextPosition;
        }
        
        setIsTransitioning(true);
        return nextPosition;
      });
    }, 3000); // 3 second pause

    return () => clearInterval(interval);
  }, [totalWidth, viewportWidth, singleSetWidth]);

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
    setCurrentPosition(prev => {
      const scrollAmount = 400;
      const newPos = prev - scrollAmount;
      
      // If we go before start, jump to equivalent position in second set
      if (newPos < 0 && singleSetWidth > 0) {
        return singleSetWidth + newPos;
      }
      return Math.max(0, newPos);
    });
  }, [singleSetWidth]);

  const handleNext = useCallback(() => {
    if (singleSetWidth === 0) return;
    
    setCurrentPosition(prev => {
      const scrollAmount = 400;
      let nextPos = prev + scrollAmount;
      
      // When we reach end of first set, continue seamlessly
      // When we reach end of second set, reset to equivalent in first set
      if (nextPos >= singleSetWidth) {
        // Disable transition for instant reset
        setIsTransitioning(false);
        nextPos = nextPos - singleSetWidth;
        
        // Re-enable transition after a brief moment
        setTimeout(() => {
          setIsTransitioning(true);
        }, 50);
        
        return nextPos;
      }
      
      setIsTransitioning(true);
      return nextPos;
    });
  }, [singleSetWidth]);

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
            className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8"
            style={{
              transform: `translate3d(-${currentPosition}px, 0, 0)`,
              willChange: 'transform',
              transition: isTransitioning ? 'transform 1s ease-in-out' : 'none'
            }}
          >
            {images.map((image, index) => {
              // Use modulo to get correct image class pattern
              const originalIndex = index % baseImages.length;
              const imageClass = getImageClass(originalIndex);
              const isPriority = index < 6 || (index >= baseImages.length && index < baseImages.length + 6); // First 6 of each set load eagerly
              
              return (
                <div
                  key={`${image.src}-${index}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={isPriority ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={isPriority ? "high" : "low"}
                    className={`${imageClass} object-cover rounded-lg shadow-xl`}
                    onLoad={() => handleImageLoad(originalIndex)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: Math.ceil(baseImages.length / 2) }).map((_, index) => {
          // Calculate position relative to first set only
          const positionInSet = currentPosition % singleSetWidth;
          const activeIndex = Math.floor(positionInSet / 400);
          
          return (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'w-8 bg-gray-800'
                  : 'w-2 bg-gray-400'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImageSlider;