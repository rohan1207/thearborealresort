import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const HERO_VIDEO_SRC = "/YOUTUBE.mp4";

  const handleVideoEnd = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/home");
    }, 450);
  };

  return (
    <motion.main
      className="min-h-screen w-full bg-[#f5f3ed] flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {/* Warm up hero video in browser cache before /home */}
      <video
        src={HERO_VIDEO_SRC}
        preload="auto"
        muted
        playsInline
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
        onLoadedData={() => {
          try {
            sessionStorage.setItem("heroVideoPrimed", "1");
          } catch (_) {}
        }}
      />

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto bg-[#f5f3ed] overflow-hidden">
        <video
          className="block w-full h-auto object-contain"
          autoPlay
          muted
          preload="auto"
          playsInline
          onEnded={handleVideoEnd}
        >
          <source src="/landing.mp4" type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute right-0 top-0 h-full bg-[#f5f3ed]"
          style={{ width: "2px" }}
        />
        <div
          className="pointer-events-none absolute left-0 bottom-0 w-full bg-[#f5f3ed]"
          style={{ height: "2px" }}
        />
      </div>
    </motion.main>
  );
};

export default LandingPage;
