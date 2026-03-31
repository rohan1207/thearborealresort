import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../utils/api";
import { useGlobalSEO } from "../hooks/useGlobalSEO";
import {
  FiSun,
  FiWind,
  FiFeather,
  FiGift,
  FiHome,
  FiGrid,
  FiEye,
  FiMonitor,
} from "react-icons/fi";
import {
  MdOutlineFastfood,
  MdOutlineDirectionsCar,
  MdOutlinePark,
  MdOutlineBathtub,
  MdOutlineShower,
  MdOutlinePool,
  MdOutlineCheckroom,
  MdOutlineCountertops,
  MdOutlineKingBed,
  MdOutlineCoffeeMaker,
  MdOutlineLocalBar,
  MdOutlineWaterDrop,
  MdOutlineWifi,
  MdOutlineBathtub as MdOutlineBathtubAlt,
} from "react-icons/md";

const slugify = (value = "") =>
  (value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const parseImages = (imageData) => {
  if (Array.isArray(imageData)) {
    return imageData.flatMap((img) => {
      if (typeof img === "string") {
        if (img.startsWith("http://") || img.startsWith("https://")) {
          return img;
        }
        return img.split(",").map((i) => i.trim());
      }
      return img;
    });
  }
  return [];
};

// Icon mapping copied from Rooms.jsx (no hardcoded labels, only visuals)
const getAmenityIcon = (amenity) => {
  if (!amenity) return <FiGift className="w-5 h-5" />;

  const amenityLower = String(amenity).toLowerCase();

  // Common amenities
  if (amenityLower.includes("wifi") || amenityLower.includes("wi-fi"))
    return <MdOutlineWifi className="w-5 h-5" />;
  if (amenityLower.includes("mini bar") || amenityLower.includes("minibar"))
    return <MdOutlineLocalBar className="w-5 h-5" />;
  if (amenityLower.includes("coffee") || amenityLower.includes("tea"))
    return <MdOutlineCoffeeMaker className="w-5 h-5" />;
  if (amenityLower.includes("sofa") || amenityLower.includes("sitting area"))
    return <MdOutlineKingBed className="w-5 h-5" />;
  if (amenityLower.includes("work table") || amenityLower.includes("desk"))
    return <FiMonitor className="w-5 h-5" />;

  // Room features
  if (
    amenityLower.includes("forest view") ||
    amenityLower.includes("mountain view")
  )
    return <FiEye className="w-5 h-5" />;
  if (amenityLower.includes("four-poster") || amenityLower.includes("bed"))
    return <MdOutlineKingBed className="w-5 h-5" />;
  if (amenityLower.includes("balcony") || amenityLower.includes("terrace"))
    return <MdOutlineBathtubAlt className="w-5 h-5" />;
  if (amenityLower.includes("room") || amenityLower.includes("suite"))
    return <FiHome className="w-5 h-5" />;

  // Bath and wellness
  if (amenityLower.includes("bathtub") || amenityLower.includes("bath"))
    return <MdOutlineBathtubAlt className="w-5 h-5" />;
  if (amenityLower.includes("shower")) return <MdOutlineShower className="w-5 h-5" />;
  if (
    amenityLower.includes("toiletries") ||
    amenityLower.includes("bathroom")
  )
    return <MdOutlineBathtub className="w-5 h-5" />;
  if (amenityLower.includes("water") || amenityLower.includes("hot water"))
    return <MdOutlineWaterDrop className="w-5 h-5" />;

  // Other common terms
  if (amenityLower.includes("breakfast"))
    return <MdOutlineFastfood className="w-5 h-5" />;
  if (amenityLower.includes("transfer") || amenityLower.includes("car"))
    return <MdOutlineDirectionsCar className="w-5 h-5" />;
  if (amenityLower.includes("forest") || amenityLower.includes("trail"))
    return <MdOutlinePark className="w-5 h-5" />;
  if (amenityLower.includes("pool") || amenityLower.includes("swim"))
    return <MdOutlinePool className="w-5 h-5" />;
  if (
    amenityLower.includes("air") ||
    amenityLower.includes("conditioning") ||
    amenityLower.includes("ac")
  )
    return <FiWind className="w-5 h-5" />;
  if (amenityLower.includes("amenities") || amenityLower.includes("premium"))
    return <FiGift className="w-5 h-5" />;
  if (amenityLower.includes("towel") || amenityLower.includes("robe"))
    return <MdOutlineCheckroom className="w-5 h-5" />;
  if (amenityLower.includes("mirror") || amenityLower.includes("vanity"))
    return <MdOutlineCountertops className="w-5 h-5" />;
  if (amenityLower.includes("view") || amenityLower.includes("outdoor"))
    return <FiSun className="w-5 h-5" />;
  if (amenityLower.includes("hair") || amenityLower.includes("dryer"))
    return <FiFeather className="w-5 h-5" />;

  return <FiGrid className="w-5 h-5" />;
};

const UpdatedRooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedRoomName, selectedRoomSlug } = location.state || {};

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch rooms once
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/rooms");
        if (data?.success && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms(data.rooms);
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error("Failed to load rooms for UpdatedRooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Initial tab selection (used by Villaslider → Rooms link)
  useEffect(() => {
    if (!rooms.length) return;

    const targetSlug =
      selectedRoomSlug ||
      (selectedRoomName ? slugify(selectedRoomName) : null);

    if (!targetSlug) return;

    const normalizedTarget = slugify(targetSlug).replace(/-room(s)?$/, "");

    const index = rooms.findIndex((room) => {
      const roomSlug = slugify(room.slug || room.name || "").replace(
        /-room(s)?$/,
        ""
      );
      return (
        roomSlug === normalizedTarget ||
        roomSlug.includes(normalizedTarget) ||
        normalizedTarget.includes(roomSlug)
      );
    });

    if (index !== -1) {
      setActiveTab(index);
    }
  }, [rooms, selectedRoomName, selectedRoomSlug]);

  const { seoSettings } = useGlobalSEO();
  const siteUrl = seoSettings?.siteUrl || window.location.origin;
  const ogImage = seoSettings?.defaultOgImage || `${siteUrl}/slider5.webp`;

  const currentRoom =
    rooms.length > 0 ? rooms[Math.min(activeTab, rooms.length - 1)] : null;

  const roomMetaTitle = currentRoom?.metaTitle
    ? `${currentRoom.metaTitle} | ${seoSettings?.siteName || "The Arboreal Resort"}`
    : currentRoom?.name
    ? `The ${currentRoom.name} | ${seoSettings?.siteName || "The Arboreal Resort"}`
    : `Rooms | ${seoSettings?.siteName || "The Arboreal Resort"}`;

  const roomMetaDescription =
    currentRoom?.metaDescription ||
    currentRoom?.description?.substring(0, 160) ||
    `Explore rooms at ${seoSettings?.siteName || "The Arboreal Resort"} in Lonavala.`;

  const roomOgImage =
    (currentRoom?.images &&
      currentRoom.images.length > 0 &&
      currentRoom.images[0]) ||
    ogImage;

  const roomCanonicalUrl =
    currentRoom?.canonicalUrl ||
    `${siteUrl}/rooms${currentRoom?.slug ? `/${currentRoom.slug}` : ""}`;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{roomMetaTitle}</title>
          <meta name="description" content={roomMetaDescription} />
        </Helmet>
        <div className="min-h-screen bg-[#f8f6f0] pt-24 flex items-center justify-center">
          <p className="text-sm sm:text-base text-[#6B6B6B] font-normal">
            Loading rooms…
          </p>
        </div>
      </>
    );
  }

  if (!currentRoom) {
    return (
      <>
        <Helmet>
          <title>{roomMetaTitle}</title>
          <meta name="description" content={roomMetaDescription} />
        </Helmet>
        <div className="min-h-screen bg-[#f8f6f0] pt-24 flex items-center justify-center">
          <p className="text-sm sm:text-base text-[#6B6B6B] font-normal">
            No rooms available at the moment.
          </p>
        </div>
      </>
    );
  }

  const images = parseImages(currentRoom.image || currentRoom.images || []);
  const heroImage = images[0];

  const stayIncludes = currentRoom.your_stays_include || [];
  const roomAmenities =
    currentRoom.amenities || currentRoom[" amenities"] || [];
  const bathWellness =
    currentRoom.bath_and_wellness || currentRoom["bath_and_wellness"] || [];

  const handleBookNow = () => {
    navigate("/booking", {
      state: {
        suggestedRoom: currentRoom.name,
      },
    });
  };

  const otherRooms = rooms.filter((_, i) => i !== activeTab);

  const handleRoomChange = (index) => {
    setActiveTab(index);

    const lenisInstance = window.lenis;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{roomMetaTitle}</title>
        <meta name="description" content={roomMetaDescription} />
        {currentRoom?.seoKeywords && currentRoom.seoKeywords.length > 0 && (
          <meta name="keywords" content={currentRoom.seoKeywords.join(", ")} />
        )}
        <link rel="canonical" href={roomCanonicalUrl} />
        <meta property="og:title" content={roomMetaTitle} />
        <meta property="og:description" content={roomMetaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={roomCanonicalUrl} />
        <meta property="og:image" content={roomOgImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={roomMetaTitle} />
        <meta name="twitter:description" content={roomMetaDescription} />
        <meta name="twitter:image" content={roomOgImage} />
      </Helmet>

      <div className="min-h-screen bg-[#f8f6f0] pt-24 sm:pt-[165px] pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Page heading */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-2 sm:mb-3">
              Our Rooms
            </p>
            <h1 className="text-xl sm:text-2xl text-[#1a1a1a] font-normal">
            Experience Luxury and Nature Combined
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
            {rooms.map((room, index) => (
              <button
                key={room._id || room.slug || room.name || index}
                onClick={() => handleRoomChange(index)}
                className={`text-xs sm:text-sm px-3 sm:px-4 py-2 border-b-2 whitespace-nowrap transition-colors duration-300 ${
                  activeTab === index
                    ? "border-[#1a1a1a] text-[#1a1a1a]"
                    : "border-transparent text-[#6B6B6B] hover:text-[#1a1a1a]"
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>

          {/* Hero image – slightly larger */}
          {heroImage && (
            <div className="w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] bg-[#e5e1d8] overflow-hidden mb-10">
              <img
                src={heroImage}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Section 1 – description (left text, right image) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl text-[#1a1a1a] font-normal mb-3">
                {currentRoom.name}
              </h2>
              <p className="text-sm sm:text-base text-[#6B6B6B] font-normal leading-relaxed mb-4">
                {currentRoom.description}
              </p>
            </div>
            <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] bg-[#e5e1d8] overflow-hidden">
              <img
                src={images[1] || heroImage}
                alt={currentRoom.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Section 2 – YOUR STAY INCLUDES (right text, left image) */}
          {stayIncludes.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start mb-12">
              <div className="order-2 md:order-1 w-full h-[220px] sm:h-[260px] md:h-[300px] bg-[#e5e1d8] overflow-hidden">
                <img
                  src={images[2] || images[1] || heroImage}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="order-1 md:order-2">
                <h3 className="text-sm sm:text-base tracking-[0.22em] uppercase text-[#1a1a1a] font-normal mb-4">
                  Your Stay Includes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-[#6B6B6B] font-normal mb-4">
                  {stayIncludes.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-[#1a1a1a]">
                        {getAmenityIcon(item)}
                      </div>
                      <span className="text-xs sm:text-sm text-[#6B6B6B] leading-tight">
                        {typeof item === "string" ? item : item.label || item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3 – ROOM AMENITIES (left text, right image) */}
          {roomAmenities.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start mb-12">
              <div>
                <h3 className="text-sm sm:text-base tracking-[0.22em] uppercase text-[#1a1a1a] font-normal mb-4">
                  Room Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-[#6B6B6B] font-normal">
                  {roomAmenities.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-[#1a1a1a]">
                        {getAmenityIcon(typeof item === "string" ? item : item.label)}
                      </div>
                      <span className="text-xs sm:text-sm text-[#6B6B6B] leading-tight">
                        {typeof item === "string" ? item : item.label || item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] bg-[#e5e1d8] overflow-hidden">
                <img
                  src={images[3] || images[2] || heroImage}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Section 4 – BATH & WELLNESS (left image, right text for zigzag) */}
          {bathWellness.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start mb-12">
              <div className="w-full h-[220px] sm:h-[260px] md:h-[300px] bg-[#e5e1d8] overflow-hidden">
                <img
                  src={images[4] || images[3] || heroImage}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base tracking-[0.22em] uppercase text-[#1a1a1a] font-normal mb-4">
                  Bath &amp; Wellness
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-[#6B6B6B] font-normal">
                  {bathWellness.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                      <div className="w-12 h-12 rounded-full border border-gray-300 bg-transparent flex items-center justify-center text-[#1a1a1a]">
                        {getAmenityIcon(item)}
                      </div>
                      <span className="text-xs sm:text-sm text-[#6B6B6B] leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gallery – show all images for this room */}
          {images.length > 1 && (
            <div className="mb-12">
              <h3 className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#6B6B6B] font-normal mb-4">
                Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="w-full h-48 sm:h-52 md:h-56 bg-[#e5e1d8] overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`${currentRoom.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check availability */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={handleBookNow}
              className="px-8 sm:px-10 py-3 text-xs sm:text-sm tracking-[0.18em] uppercase font-medium bg-[#1a1a1a] text-white hover:bg-[#000000] transition-colors duration-300 rounded-full"
            >
              Check Availability
            </button>
          </div>

          {/* Other rooms */}
          {otherRooms.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-4">
                Check Out These Rooms Also
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {otherRooms.slice(0, 3).map((room) => {
                  const idx = rooms.indexOf(room);
                  const thumb = parseImages(room.image || room.images || [])[0];
                  return (
                    <button
                      key={room._id || room.slug || room.name}
                      onClick={() => handleRoomChange(idx)}
                      className="text-left bg-[#f5f3ed] hover:bg-[#efe9dd] transition-colors duration-300"
                    >
                      {thumb && (
                        <div className="w-full h-56 bg-[#e5e1d8] overflow-hidden">
                          <img
                            src={thumb}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="px-4 py-3">
                        <p className="text-sm text-[#1a1a1a] font-normal leading-snug">
                          {room.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdatedRooms;

