import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FiVolumeX, FiVolume2 } from "react-icons/fi";
const Hero = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    rooms: 1,
    adults: 2,
    children: 0,
  });
  const [loading, setLoading] = useState(false);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  // Hardcoded Cloudinary URLs - UPDATE AFTER RUNNING uploadHeroVideo.js
  // Run: node arboreal-resort-backend/scripts/uploadHeroVideo.js
  // Then copy the URLs from console output and paste them here
  // Cloud name: dxevy8mea
  // Cloudinary Video URLs (High Quality)
  const CLOUDINARY_VIDEO_DESKTOP = 'https://res.cloudinary.com/dxevy8mea/video/upload/q_auto:good,w_1920,f_auto/Arboreal/hero/hero4.mp4';
  const CLOUDINARY_VIDEO_MOBILE = 'https://res.cloudinary.com/dxevy8mea/video/upload/q_auto:good,w_1280,f_auto/Arboreal/hero/hero4.mp4';
  const CLOUDINARY_VIDEO_WEBM = 'https://res.cloudinary.com/dxevy8mea/video/upload/q_auto:good,w_1920,f_webm/Arboreal/hero/hero4.mp4';
  const CLOUDINARY_VIDEO_POSTER = 'https://res.cloudinary.com/dxevy8mea/video/upload/q_auto:good,so_1/Arboreal/hero/hero4.jpg';

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

  // Progressive loading - load video after page is ready
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

  // User interaction trigger (helps with autoplay restrictions)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!shouldLoadVideo) {
        setShouldLoadVideo(true);
      }
      if (videoRef.current && !isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('scroll', handleUserInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
    window.addEventListener('click', handleUserInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, [shouldLoadVideo, isVideoPlaying]);

  const openDate = (ref) => {
    if (ref?.current) {
      if (typeof ref.current.showPicker === "function") {
        ref.current.showPicker();
      } else {
        ref.current.focus();
        ref.current.click();
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);

    try {
      // Redirect to availability page with search params
      const searchParams = new URLSearchParams({
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        rooms: formData.rooms,
        adults: formData.adults,
        children: formData.children,
        name: formData.name,
      });

      navigate(`/availability?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get video URL based on device
  const getVideoUrl = () => {
    if (!CLOUDINARY_VIDEO_DESKTOP || CLOUDINARY_VIDEO_DESKTOP === 'YOUR_DESKTOP_URL_HERE') {
      // Fallback to local video if Cloudinary URLs not set
      return '/hero4.mp4';
    }
    return isMobile ? CLOUDINARY_VIDEO_MOBILE : CLOUDINARY_VIDEO_DESKTOP;
  };

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    // Video is ready to play
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked, that's okay
      });
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Poster Image - shown while video is loading */}
      {(CLOUDINARY_VIDEO_POSTER !== 'YOUR_POSTER_URL_HERE' ? CLOUDINARY_VIDEO_POSTER : '/video_alt.png') && !isVideoPlaying && (
        <img
          src={CLOUDINARY_VIDEO_POSTER !== 'YOUR_POSTER_URL_HERE' ? CLOUDINARY_VIDEO_POSTER : '/video_alt.png'}
          alt="The Arboreal Resort"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ 
            opacity: isVideoPlaying ? 0 : 1,
            zIndex: 1
          }}
          loading="eager"
          fetchPriority="high"
        />
      )}

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-5 right-6 z-20 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? <FiVolumeX /> : <FiVolume2 />}
      </button>

      {/* Cloudinary Optimized Video */}
      {shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          preload={isMobile ? "none" : "metadata"}
          poster={CLOUDINARY_VIDEO_POSTER !== 'YOUR_POSTER_URL_HERE' ? CLOUDINARY_VIDEO_POSTER : '/video_alt.png'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ 
            willChange: 'auto',
            opacity: isVideoPlaying ? 1 : 0,
            zIndex: 2
          }}
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoCanPlay}
          onPlay={handleVideoPlay}
          onError={(e) => {
            console.error('Video error:', e);
            setIsVideoPlaying(false);
          }}
        >
          {/* WebM first (better compression, high quality) */}
          {CLOUDINARY_VIDEO_WEBM !== 'YOUR_WEBM_URL_HERE' && (
            <source src={CLOUDINARY_VIDEO_WEBM} type="video/webm" />
          )}
          {/* MP4 fallback */}
          <source src={getVideoUrl()} type="video/mp4" />
        </video>
      )}

      {/* Gradient Overlay - lighter to show more of the video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col px-8 md:px-16 lg:px-24 pt-32">
        {/* Text Content - Left Aligned
        <div className="text-white max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-base tracking-wider mb-4 font-light"
          >
            The Arboreal Resort
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight"
          >
            Find You Comfort
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif"
          >
            Rooms
          </motion.h2>
        </div> */}

        
      </div>
    </div>
  );
};

export default Hero;
