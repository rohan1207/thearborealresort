import React from "react";

const RoomsHero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          alt="Luxury Pool Resort"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      </div>

      {/* Content Container - positioned at bottom */}
      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 absolute bottom-0">
        <div className="max-w-7xl mx-auto pb-8 md:pb-12 lg:pb-16">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-16">
            {/* Left side - Main heading */}
            <div className="flex-1">
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-light text-white leading-none tracking-tight">
                Your Rooms
              </h1>
            </div>

            {/* Right side - Description */}
            <div className="flex-1 flex justify-start md:justify-end">
              <div className="max-w-md">
                <p className="text-lg md:text-xl text-white font-light leading-relaxed">
                  We are happy to offer our guests a truly fabulous experience of a relaxing and memorable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white via-50% to-transparent opacity-30"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 md:right-16 lg:right-24">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-px h-12 bg-white opacity-60"></div>
          <div className="w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
        </div>
      </div>

      {/* Palm leaf decoration overlay */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path
            d="M20,180 Q40,120 80,100 Q120,80 160,60 Q180,40 190,20"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M30,190 Q60,140 100,120 Q140,100 180,80"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
};

export default RoomsHero;