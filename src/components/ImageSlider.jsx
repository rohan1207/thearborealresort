import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomeSettings } from '../hooks/useHomeSettings';

const ImageSlider = () => {
  const { settings, loading } = useHomeSettings();
  const [currentPosition, setCurrentPosition] = useState(0);
  const containerRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const resizeTimeoutRef = useRef(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Slider images from backend home settings
  const sliderImages = useMemo(() => {
    const raw = settings?.sliderImages;
    if (!Array.isArray(raw) || raw.length === 0) return [];

    // Normalize possible formats: string URLs or objects with url/src
    return raw
      .map((item, index) => {
        const url =
          typeof item === 'string'
            ? item
            : item?.url || item?.src || '';

        if (!url) return null;

        return {
          name: `slider-${index}`,
          url,
        };
      })
      .filter(Boolean);
  }, [settings?.sliderImages]);

  // Use backend slider images - duplicate for infinite scroll
  const baseImages = sliderImages.map((img, index) => ({
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

  // Auto-scroll with infinite loop - seamless and scroll-aware
  useEffect(() => {
    if (totalWidth === 0 || viewportWidth === 0 || singleSetWidth === 0) return;

    const interval = setInterval(() => {
      // If Lenis is actively scrolling the page, skip this tick so
      // auto-scroll never fights with user scroll. We don't "catch up";
      // we just wait for the next 3s tick.
      if (typeof window !== 'undefined' && window.isLenisScrolling) {
        return;
          }

          setCurrentPosition(prev => {
            const scrollAmount = 400; // Move by 400px each time
            let nextPosition = prev + scrollAmount;
            
        // When we've scrolled past the first set, reset to equivalent position in first set.
        // Disable transition just for the wrap frame to keep it seamless.
            if (nextPosition >= singleSetWidth) {
          const wrappedPosition = nextPosition - singleSetWidth;
              setIsTransitioning(false);
          if (typeof window !== 'undefined' && window.requestAnimationFrame) {
            window.requestAnimationFrame(() => {
                  setIsTransitioning(true);
            });
          } else {
            setIsTransitioning(true);
          }
          return wrappedPosition;
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
        return 'h-[138px] sm:h-[176px] w-[186px] sm:w-[236px]';
      case 1: // Large horizontal
        return 'h-[194px] sm:h-[236px] w-[248px] sm:w-[314px]';
      case 2: // Medium vertical
        return 'h-[216px] sm:h-[258px] w-[156px] sm:w-[196px]';
      case 3: // Tall vertical
        return 'h-[248px] sm:h-[300px] w-[170px] sm:w-[220px]';
      default:
        return 'h-[194px] sm:h-[236px] w-[248px] sm:w-[314px]';
    }
  }, []);

  // Handle image load with debouncing
  const handleImageLoad = useCallback((index) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    
    // Debounce full dimension recalculation so totalWidth and singleSetWidth
    // are based on all loaded images, not just the first few.
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      updateDimensions();
    }, 100);
  }, [updateDimensions]);

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

  // If data is still loading and we don't have any images yet,
  // show lightweight placeholder cards so the section isn't blank.
  const isLoadingWithoutImages = loading && baseImages.length === 0;

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
          {isLoadingWithoutImages ? (
            <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-8">
              {Array.from({ length: 6 }).map((_, index) => {
                const imageClass = getImageClass(index);
                return (
                  <div
                    key={`placeholder-${index}`}
                    className={`flex-shrink-0 ${imageClass} bg-gray-300/70 animate-pulse`}
                  />
                );
              })}
            </div>
          ) : (
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
                const isPriority =
                  index < 6 ||
                  (index >= baseImages.length && index < baseImages.length + 6); // First 6 of each set load eagerly
              
              return (
                <div
                  key={`${image.src}-${index}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                      loading={isPriority ? 'eager' : 'lazy'}
                    decoding="async"
                      fetchPriority={isPriority ? 'high' : 'low'}
                    className={`${imageClass} object-cover`}
                    onLoad={() => handleImageLoad(originalIndex)}
                  />
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      {/* Gallery CTA pill */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-white shadow-sm hover:bg-black hover:shadow-md transition-all duration-300"
        >
          See More
        </Link>
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