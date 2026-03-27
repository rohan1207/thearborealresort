import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useHomeSettings } from "../hooks/useHomeSettings";

const AccommodationCards = memo(() => {
  // Don't block render - use defaults immediately
  const { settings } = useHomeSettings();

  const fallbackAccommodations = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/accommodation/ac2",
      category: "ACCOMMODATION",
      title: "The Tree-House Resort",
      description:
        "Our elevated structures bring you to the treetops of the valley, offering an unparalleled experience akin to the best tree house in Lonavala. With the lush green rainforest as your backdrop, the view is truly mesmerizing and calming.",
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/dxevy8mea/image/upload/q_auto:good,w_1200,f_auto/Arboreal/accommodation/ac",
      category: "ACCOMMODATION",
      title: "The Amazing Nature",
      description:
        "Our elevated structures bring you to the treetops of the valley, offering an unparalleled experience akin to the best tree house in Lonavala. With the lush green rainforest as your backdrop, the view is truly mesmerizing and calming.",
    },
  ];

  const accommodationsFromSettings =
    settings?.accommodations && settings.accommodations.length > 0
      ? settings.accommodations.map((item, index) => ({
          id: index + 1,
          image: item.imageUrl || fallbackAccommodations[index]?.image,
          category: item.category || "ACCOMMODATION",
          title: item.title || fallbackAccommodations[index]?.title,
          description: item.description || fallbackAccommodations[index]?.description,
        }))
      : fallbackAccommodations;

  const accommodations = accommodationsFromSettings;

  return (
    <section 
      className="py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f5f3ed]"
      style={{
        transform: 'translateZ(0)',
        willChange: 'auto',
        contain: 'layout style paint', // CSS containment for better scroll performance
        contentVisibility: 'auto',     // Let browser skip work when off-screen
        containIntrinsicSize: '900px 900px', // Reserve space to avoid big relayouts
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {accommodations.map((item, index) => {
            const isFirst = index === 0;
            return (
            <div
              key={item.id}
              className="group"
              style={{ 
                transform: 'translateZ(0)', // GPU acceleration
              }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden mb-4 sm:mb-5 md:mb-6 rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[280px] sm:h-[350px] md:h-[500px] object-cover"
                  loading={isFirst ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={isFirst ? "high" : "low"}
                  style={{ 
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                  }}
                />
              </div>

              {/* Content */}
              <div className="space-y-3 sm:space-y-4">
                {/* Category */}
                <p className="text-xs tracking-[0.2em] text-gray-600 font-light uppercase">
                  {item.category}
                </p>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          )})}
        </div>

        {/* View All Button */}
        <div
          className="flex justify-center mt-10 sm:mt-12 md:mt-16"
          style={{ 
            transform: 'translateZ(0)', // GPU acceleration
          }}
        >
          <Link to="/rooms">
          <button className="group relative px-6 sm:px-8 py-2.5 sm:py-3 overflow-hidden rounded-full">
            {/* Button Text */}
            <span className="relative z-10 text-xs sm:text-sm tracking-[0.15em] text-gray-900 font-light uppercase transition-colors duration-300 group-hover:text-white">
              View all accommodation
            </span>

            {/* Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-900"></div>

            {/* Hover Background */}
            <div className="absolute inset-0 bg-gray-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
});

AccommodationCards.displayName = 'AccommodationCards';

export default AccommodationCards;
