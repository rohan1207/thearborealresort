import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiVolumeX, FiVolume2 } from "react-icons/fi";
import { useHomeSettings } from "../hooks/useHomeSettings";

const Hero = () => {
  const { settings } = useHomeSettings();
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef(null);
  const frameRef = useRef(null);

  // Hero video from public folder
  const HERO_VIDEO_SRC = "/YOUTUBE.mp4";
  const heroPosterFromSettings = settings?.heroPosterUrl || "";
  const FALLBACK_POSTER = "/video_alt.png";

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

  // Load immediately on /home (landing already pre-warms hero video)
  useEffect(() => {
    const primed = (() => {
      try {
        return sessionStorage.getItem("heroVideoPrimed") === "1";
      } catch (_) {
        return false;
      }
    })();
    if (primed) {
      setShouldLoadVideo(true);
      return;
    }
    const timer = setTimeout(() => setShouldLoadVideo(true), isMobile ? 250 : 120);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Start playback only when the framed hero is in viewport
  useEffect(() => {
    if (!frameRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().catch(() => {});
        } else if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  // Manual play fallback on first interaction (for stricter mobile autoplay policies)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!shouldLoadVideo) setShouldLoadVideo(true);
      if (videoRef.current && !isVideoPlaying) {
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
    window.addEventListener("click", handleFirstInteraction, { once: true, passive: true });
    return () => {
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, [isVideoPlaying, shouldLoadVideo]);

  const getVideoUrl = () => HERO_VIDEO_SRC;

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  const handleVideoCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <section className="w-full bg-[#f5f3ed] pt-24 sm:pt-[150px] lg:pt-[140px] pb-8 sm:pb-10">
      <div className="w-full px-0">
        <div
          ref={frameRef}
          className="relative w-full h-[72vh] sm:h-[72vh] lg:h-[82vh] overflow-hidden border border-black/10 bg-black/10"
        >
          {/* Poster Image - visible until video is ready/playing */}
          {(heroPosterFromSettings || FALLBACK_POSTER) && (
            <img
              src={heroPosterFromSettings || FALLBACK_POSTER}
              alt="The Arboreal Resort"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: isVideoLoaded && isVideoPlaying ? 0 : 1, zIndex: 1 }}
              loading="eager"
              fetchPriority="high"
            />
          )}

          {/* Hero video */}
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              preload="metadata"
              poster={heroPosterFromSettings || FALLBACK_POSTER}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: isVideoPlaying ? 1 : 0, zIndex: 2 }}
              onLoadedData={handleVideoLoaded}
              onCanPlay={handleVideoCanPlay}
              onPlay={handleVideoPlay}
              onError={() => setIsVideoPlaying(false)}
            >
              <source src={getVideoUrl()} type="video/mp4" />
            </video>
          )}

          {/* Subtle elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10 z-[3]" />

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 z-10 bg-black/45 text-white rounded-full p-2.5 sm:p-3 hover:bg-black/65 transition-colors"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
