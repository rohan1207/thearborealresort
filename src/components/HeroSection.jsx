import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const [showTextOverlay, setShowTextOverlay] = useState(true);
  const [showPlayCursor, setShowPlayCursor] = useState(false);
  const [showCloseCursor, setShowCloseCursor] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const posterRef = useRef(null);
  const heroRef = useRef(null);

  // Public assets: place YOUTUBE.mp4 and hero-poster image in /public
  const HERO_VIDEO_URL = '/YOUTUBE.mp4';
  const HERO_POSTER_IMAGE = '/hero-poster.jpg';
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Progressive loading
  useEffect(() => {
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => {
        setShouldLoadVideo(true);
      }, isMobile ? 2000 : 1000);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => {
        setTimeout(() => {
          setShouldLoadVideo(true);
        }, isMobile ? 2000 : 1000);
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [isMobile]);

  // Handle video play
  const handlePlayVideo = useCallback(() => {
    // Ensure main video element is mounted
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
    }

    // Reset any pending state first
    setPendingPlay(true);

    // Small delay to ensure video element is ready
    setTimeout(() => {
      if (videoRef.current && !isVideoPlaying) {
        // Reset video to start
        videoRef.current.currentTime = 0;
        
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true);
            setPendingPlay(false);
          })
          .catch((error) => {
            // If play fails (not ready yet), mark as pending and let onCanPlay handle it
            console.log('Video play attempt failed, will retry on canPlay:', error);
            setPendingPlay(true);
          });
      } else if (!videoRef.current) {
        // Video not mounted yet – mark play as pending
        setPendingPlay(true);
      }
    }, 50);
  }, [isVideoPlaying, shouldLoadVideo]);

  // Handle video close
  const handleCloseVideo = useCallback(() => {
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      }
  }, [isVideoPlaying]);

  // Handle click on hero
  const handleHeroClick = useCallback((e) => {
    // Prevent event from bubbling if needed
    e.stopPropagation();
    
    if (!isVideoPlaying) {
      handlePlayVideo();
    } else {
      handleCloseVideo();
    }
  }, [isVideoPlaying, handlePlayVideo, handleCloseVideo]);

  // Cursor management - reset on video state change
  useEffect(() => {
    if (isVideoPlaying) {
      setShowPlayCursor(false);
      setShowTextOverlay(false);
    } else {
      setShowCloseCursor(false);
      // When we return to poster, briefly show text again then hide
      setShowTextOverlay(true);
      const timer = setTimeout(() => {
        setShowTextOverlay(false);
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isVideoPlaying]);

  const getVideoUrl = () => HERO_VIDEO_URL;

  const handleVideoCanPlay = useCallback(() => {
    // If user has already requested play, start as soon as video can play
    if (pendingPlay && videoRef.current && !isVideoPlaying) {
      // Ensure video is at start
      videoRef.current.currentTime = 0;
      
      videoRef.current
        .play()
        .then(() => {
          setIsVideoPlaying(true);
          setPendingPlay(false);
        })
        .catch((error) => {
          // Keep pendingPlay true; user can click again if needed
          console.log('Video play from canPlay failed:', error);
        });
    }
  }, [pendingPlay, isVideoPlaying]);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  }, []);

  // Reset video state when hero leaves/enters viewport so interaction always feels fresh
  useEffect(() => {
    if (!heroRef.current) return;

    const element = heroRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isVideoPlaying) {
            // Hero scrolled out of view - pause and reset
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0; // Reset to beginning
            }
            setIsVideoPlaying(false);
            setPendingPlay(false);
          } else if (entry.isIntersecting && !isVideoPlaying) {
            // Hero scrolled back into view - ensure clean state
            setPendingPlay(false);
            if (videoRef.current) {
              videoRef.current.currentTime = 0; // Ensure video is at start
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVideoPlaying]);

  // Text animation variants
  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
      },
    },
  };

  const headline = "Enchanted Land of Blue and Green";
  const words = headline.split(" ");

  return (
    <>
      {/* Custom Cursor Styles */}
      <style>{`
        .hero-play-cursor {
          cursor: none !important;
        }
        .hero-play-cursor * {
          cursor: none !important;
        }
        .hero-close-cursor {
          cursor: none !important;
        }
        .hero-close-cursor * {
          cursor: none !important;
        }
      `}</style>

      <div
        id="hero-section"
        ref={heroRef}
        className={`relative h-screen w-full overflow-hidden ${
          showPlayCursor && !isVideoPlaying ? 'hero-play-cursor' : ''
        } ${showCloseCursor && isVideoPlaying ? 'hero-close-cursor' : ''}`}
        onClick={handleHeroClick}
        onMouseEnter={() => {
          if (!isVideoPlaying) {
            setShowPlayCursor(true);
          } else {
            setShowCloseCursor(true);
          }
        }}
        onMouseLeave={() => {
          setShowPlayCursor(false);
          setShowCloseCursor(false);
        }}
        onMouseMove={(e) => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* Custom Cursor - Play */}
        <AnimatePresence>
          {showPlayCursor && !isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs tracking-[0.2em] uppercase whitespace-nowrap">
                  watch complete movie
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Cursor - Close */}
        <AnimatePresence>
          {showCloseCursor && isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: mousePosition.x,
                y: mousePosition.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="fixed z-[60] pointer-events-none"
              style={{
                left: 0,
                top: 0,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center shadow-2xl">
                  <X className="w-8 h-8 text-white stroke-[3]" />
                </div>
                <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs tracking-[0.2em] uppercase whitespace-nowrap font-light drop-shadow-lg">
                  Close Video
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero poster (alt image) - visible when main video not playing */}
        <AnimatePresence>
          {!isVideoPlaying && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-10"
            >
              <video
                ref={posterRef}
                src="/postervideo.mp4"
                autoPlay
                loop
                playsInline
                muted
                className="w-full h-full object-cover"
                preload="auto"
                aria-hidden="true"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video - Load when needed, show when playing */}
        {shouldLoadVideo && (
          <motion.video
            ref={videoRef}
          loop
          playsInline
          muted={isMuted}
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover z-20"
            style={{ 
              pointerEvents: isVideoPlaying ? 'auto' : 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoPlaying ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onCanPlay={handleVideoCanPlay}
          onPlay={handleVideoPlay}
            onMouseEnter={() => {
              if (isVideoPlaying) {
                setShowCloseCursor(true);
              }
            }}
            onMouseLeave={() => {
              setShowCloseCursor(false);
          }}
            onMouseMove={(e) => {
              if (isVideoPlaying) {
                setMousePosition({ x: e.clientX, y: e.clientY });
              }
            }}
            onClick={(e) => {
              if (isVideoPlaying) {
                e.stopPropagation();
                handleCloseVideo();
              }
            }}
          >
          <source src={getVideoUrl()} type="video/mp4" />
          </motion.video>
      )}

        {/* Mute Button - Only show when video is playing */}
        <AnimatePresence>
          {isVideoPlaying && (
            <motion.button
              onClick={toggleMute}
              className="absolute bottom-8 right-8 z-30 bg-black/40 backdrop-blur-md text-white rounded-full p-4 hover:bg-black/60 border border-white/10 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hero Text Overlay - Only show briefly when video not playing */}
        <AnimatePresence>
          {showTextOverlay && !isVideoPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 md:px-12"
            >
              {/* Location/Resort Name */}
              <motion.div
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="mb-8 text-center"
              >
                <p className="font-light text-sm md:text-base tracking-[0.3em] uppercase text-white/90 mb-2">
                  THE ARBOREAL RESORT
                </p>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="text-center max-w-5xl"
              >
                <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight">
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5 + i * 0.1,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-4"
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>

              {/* Play Indicator at Bottom
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                  <Play className="w-6 h-6 text-white ml-1" fill="white" />
                </div>
                <p className="text-white/80 text-xs tracking-[0.2em] uppercase font-light">
                  Play Movie
                </p>
                <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
              </motion.div> */}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator at Bottom */}
        {!isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          >
            {/* Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-white/70 text-xs tracking-[0.3em] uppercase font-light"
            >
              Scroll to Explore
            </motion.p>

            {/* Line + bouncing dot — visible on ALL screen sizes */}
            <div style={{ position: 'relative', width: '1px', height: '64px' }}>
              {/* Static vertical line */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.4), transparent)' }} />

              {/* Bouncing dot — perfectly centered on the line */}
              <motion.div
                style={{ position: 'absolute', bottom: 0, left: '50%', marginLeft: '-4px' }}
                animate={{ y: [0, 12] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '9999px',
                    boxShadow: '0 0 6px rgba(255,255,255,0.8)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Mobile "Watch movie" button (since hover cursor doesn't work on touch) */}
        {!isVideoPlaying && isMobile && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayVideo();
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="sm:hidden absolute bottom-24 right-6 z-30 flex flex-col items-center gap-2"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
              <div className="relative w-12 h-12 bg-white/15 backdrop-blur-md rounded-full border border-white/60 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/80">
              Watch movie
            </span>
          </motion.button>
        )}
      </div>
    </>
  );
};

export default HeroSection;