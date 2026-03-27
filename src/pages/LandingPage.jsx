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

      <video
        className="w-full max-w-4xl h-auto object-contain"
        autoPlay
        muted
        preload="auto"
        playsInline
        onEnded={handleVideoEnd}
      >
        <source src="/landing.mp4" type="video/mp4" />
      </video>
    </motion.main>
  );
};

export default LandingPage;
