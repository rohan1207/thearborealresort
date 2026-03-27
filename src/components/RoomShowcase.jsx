import React, { useState, useEffect, memo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const RoomShowcase = memo(() => {
  const [centerCardIndex, setCenterCardIndex] = useState(0);
  const [rooms, setRooms] = useState([]);

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

  // Load rooms from backend to keep showcase in sync with Rooms page
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await apiFetch("/rooms");
        if (data?.success && Array.isArray(data.rooms) && data.rooms.length > 0) {
          const mapped = data.rooms
            .map((room, index) => {
              const images = Array.isArray(room.image) ? room.image : [];
              return {
                id: index + 1,
                title: room.name,
                slug: room.slug,
                images,
              };
            })
            .filter((r) => r.images && r.images.length > 0);

          if (mapped.length > 0) {
                  setRooms(mapped);
                  setCenterCardIndex(0);
          }
        }
      } catch (error) {
        // Fail silently for now – rooms will stay empty
        console.error("Failed to load rooms for RoomShowcase:", error);
      }
    };

    loadRooms();
  }, []);

  /* --------------------------- Calculate visible cards --------------------------- */
  const getVisibleCards = () => {
    const total = rooms.length;
    if (total === 0) return [];

    const leftIndex = (centerCardIndex - 1 + total) % total;
    const rightIndex = (centerCardIndex + 1) % total;

    return [
      { room: rooms[leftIndex], position: "left", index: leftIndex },
      { room: rooms[centerCardIndex], position: "center", index: centerCardIndex },
      { room: rooms[rightIndex], position: "right", index: rightIndex },
    ];
  };

  const goToPrevious = () => {
    setCenterCardIndex((prev) => {
      const total = rooms.length;
      if (total === 0) return 0;
      return (prev - 1 + total) % total;
    });
  };

  const goToNext = () => {
    setCenterCardIndex((prev) => {
      const total = rooms.length;
      if (total === 0) return 0;
      return (prev + 1) % total;
    });
  };

  if (!rooms || rooms.length === 0) {
    // Nothing to show until backend rooms load
    return null;
  }

  const visibleCards = getVisibleCards();

  return (
    <section 
      className="relative py-12 sm:py-14 md:py-16 lg:py-20 bg-[#f5f3ed] overflow-hidden"
      style={{
        transform: 'translateZ(0)',
        willChange: 'auto',
        contentVisibility: 'auto',
        contain: 'layout style paint',
        containIntrinsicSize: '700px 700px',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-2 sm:mb-3">
            Accommodations
          </p>
          <h2 className="text-3xl sm:text-4xl text-[#1a1a1a] font-normal">
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
                  if (isCenter) {
                    // Clicking center card redirects to room page
                    handleRoomNameClick(room.title, room.slug);
                  } else {
                    // Clicking left/right makes it center
                    if (position === "left") goToPrevious();
                    if (position === "right") goToNext();
                  }
                }}
                className={`
                  relative overflow-hidden rounded-sm cursor-pointer transition-all duration-300 ease-out
                  ${isCenter ? "sm:w-[60%] sm:h-[480px] scale-100" : "sm:w-[18%] sm:h-[340px] scale-90 opacity-70"}
                  ${isCenter ? "w-[55%] h-[260px]" : "w-[22%] h-[200px]"}
                `}
                style={{ 
                  willChange: isCenter ? 'transform' : 'auto',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Image */}
                <img
                  src={img}
                  alt={room.title}
                  className="w-full h-full object-cover"
                  loading={isCenter ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={isCenter ? "high" : "low"}
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
            className="text-2xl sm:text-3xl font-normal text-[#1a1a1a]"
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
});

RoomShowcase.displayName = 'RoomShowcase';

export default RoomShowcase;
