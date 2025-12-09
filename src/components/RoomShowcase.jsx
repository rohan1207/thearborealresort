import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const RoomShowcase = () => {
  const [centerCardIndex, setCenterCardIndex] = useState(0);

  const rooms = [
    {
      id: 1,
      title: "The Classic Sunroom",
      slug: "classic-sunroom",
      images: ["/Classic_Sunroom_1.jpg"],
    },
    {
      id: 2,
      title: "Forest Bathtub Room",
      slug: "forest-bathtub-room",
      images: ["/Forest_Bathtub_07.jpg"],
    },
    {
      id: 3,
      title: "Forest Private Pool Room",
      slug: "forest-private-pool-room",
      images: ["/Forest_Private_Pool_2.jpg"],
    },
    {
      id: 4,
      title: "Luxury Sunroom",
      slug: "luxury-sunroom",
      images: ["/Luxury_Sunroom_Arboreal_01.jpg"],
    },
  ];

  const navigate = useNavigate();

  const sanitizeRoomName = (name) => name.toLowerCase().replace(/ /g, "-");
  const slugifyRoomName = (name) => name.toLowerCase().replace(/ /g, "-");

  const handleRoomNameClick = (roomName, roomSlug) => {
    const canonical = sanitizeRoomName(roomName);
    navigate("/rooms", {
      state: {
        selectedRoomName: canonical,
        selectedRoomSlug: roomSlug || slugifyRoomName(canonical),
      },
    });
  };

  /* --------------------------- Calculate visible cards --------------------------- */
  const getVisibleCards = () => {
    const leftIndex = (centerCardIndex - 1 + rooms.length) % rooms.length;
    const rightIndex = (centerCardIndex + 1) % rooms.length;

    return [
      { room: rooms[leftIndex], position: "left", index: leftIndex },
      { room: rooms[centerCardIndex], position: "center", index: centerCardIndex },
      { room: rooms[rightIndex], position: "right", index: rightIndex },
    ];
  };

  const goToPrevious = () => {
    setCenterCardIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
  };

  const goToNext = () => {
    setCenterCardIndex((prev) => (prev + 1) % rooms.length);
  };

  const visibleCards = getVisibleCards();

  return (
    <section className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-[#f5f3ed] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-serif italic text-gray-600 text-lg">
            Accommodations
          </p>
          <h2 className="text-3xl font-serif text-gray-900">
            Raising Comfort To The Highest Level
          </h2>
        </div>

        {/* Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <FiChevronLeft className="text-xl sm:text-2xl text-gray-800" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <FiChevronRight className="text-xl sm:text-2xl text-gray-800" />
        </button>

        {/* Cards */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 px-2 sm:px-20">
          {visibleCards.map(({ room, position }) => {
            const isCenter = position === "center";
            const img = room.images[0];

            return (
              <div
                key={room.id + position}
                onClick={() => {
                  if (!isCenter) {
                    // Clicking left/right makes it center
                    if (position === "left") goToPrevious();
                    if (position === "right") goToNext();
                  }
                }}
                className={`
                  relative overflow-hidden rounded-sm cursor-pointer transition-all duration-500

                  ${isCenter ? "sm:w-[60%] sm:h-[480px] scale-100" : "sm:w-[18%] sm:h-[340px] scale-90 opacity-70"}

                  ${isCenter ? "w-[55%] h-[260px]" : "w-[22%] h-[200px]"}
                `}
              >
                {/* Image */}
                <img
                  src={img}
                  className="w-full h-full object-cover"
                />

                {/* Overlay for left/right */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-gray-300/30"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Title */}
        <div className="text-center mt-6 cursor-pointer">
          <h3
            className="text-2xl sm:text-3xl font-serif text-gray-900"
            onClick={() =>
              handleRoomNameClick(
                rooms[centerCardIndex].title,
                rooms[centerCardIndex].slug
              )
            }
          >
            {rooms[centerCardIndex].title}
          </h3>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {rooms.map((_, i) => (
            <button
              key={i}
              onClick={() => setCenterCardIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === centerCardIndex ? "w-6 sm:w-8 bg-gray-800" : "w-2 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomShowcase;
