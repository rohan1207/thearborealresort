import React from "react";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
        <circle cx="12" cy="12" r="3" strokeWidth="1" />
      </svg>
    ),
    title: "Luxury resort",
    description: "Experience a unique stay.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
        <path d="M8 21V12C8 8 10 6 12 6S16 8 16 12V21" strokeWidth="1" />
        <path d="M6 17C6 14 8 12 12 12S18 14 18 17" strokeWidth="1" />
      </svg>
    ),
    title: "Trained manpower",
    description: "Dedicated meal courses.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21L12 12L21 21H3Z" strokeWidth="1" />
        <path d="M12 12L12 3" strokeWidth="1" />
        <path d="M8 8L16 8" strokeWidth="1" />
        <path d="M9 16L15 16" strokeWidth="1" />
      </svg>
    ),
    title: "Dining restaurants",
    description: "Discover a medley of flavours.",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeWidth="1" />
        <circle cx="12" cy="12" r="6" strokeWidth="1" />
        <circle cx="12" cy="12" r="2" strokeWidth="1" />
        <path d="M12 2V6" strokeWidth="1" />
        <path d="M12 18V22" strokeWidth="1" />
        <path d="M2 12H6" strokeWidth="1" />
        <path d="M18 12H22" strokeWidth="1" />
      </svg>
    ),
    title: "Swimming pool",
    description: "Unwind and discover joy.",
  },
];

const RoomsFeaturesShowcase = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer"
            >
              {/* Icon Container */}
              <div className="w-24 h-24 mx-auto mb-8 bg-white rounded-full shadow-sm flex items-center justify-center border border-amber-100 group-hover:border-amber-200 group-hover:shadow-md transition-all duration-500 ease-out">
                <div className="text-amber-700 group-hover:text-amber-800 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium text-gray-900 mb-3 tracking-wide">
                {feature.title}
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed font-light tracking-wide max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsFeaturesShowcase;