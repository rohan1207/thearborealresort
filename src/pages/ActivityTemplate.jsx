import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../utils/api";
import Lightbox from "../components/Lightbox";

const ActivityTemplate = () => {
  const { activityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/activities");
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
          const fromStateId = location.state?.activityId;
          const targetId = fromStateId || activityId;
          const found = data.activities.find((a) => a._id === targetId);
          setCurrentActivity(found || data.activities[0] || null);
        } else {
          setActivities([]);
          setCurrentActivity(null);
        }
      } catch (err) {
        console.error("Failed to fetch activities for detail page:", err);
        setError("Failed to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activityId, location.state]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentActivity?._id]);

  const images = useMemo(
    () => (currentActivity?.images && currentActivity.images.length > 0 ? currentActivity.images : []),
    [currentActivity]
  );
  const primaryDisplayImage = images[1] || images[0] || "";

  const otherActivities = useMemo(
    () => activities.filter((a) => currentActivity && a._id !== currentActivity._id).slice(0, 6),
    [activities, currentActivity]
  );

  const handleSelectActivity = (id) => {
    const next = activities.find((a) => a._id === id);
    if (next) {
      setCurrentActivity(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(`/activities/${id}`, { replace: true, state: { activityId: id } });
    }
  };

  const handlePrevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const openLightbox = (index = 0) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] pt-24 flex items-center justify-center">
        <p className="text-sm sm:text-base text-[#6B6B6B]">Loading activity…</p>
      </div>
    );
  }

  if (error || !currentActivity) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] pt-24 sm:pt-[150px] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-base sm:text-lg text-[#1a1a1a] mb-2">Activity not found</p>
          <p className="text-sm text-[#6B6B6B] mb-4">{error || "Please try again later."}</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-5 sm:px-6 py-2 text-xs sm:text-sm tracking-[0.16em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300"
          >
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = currentActivity.name
    ? `${currentActivity.name} | Activities | The Arboreal Resort`
    : "Activity | The Arboreal Resort";
  const pageDescription =
    currentActivity.description ||
    "Discover curated experiences and activities at The Arboreal Resort.";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>

      <div className="min-h-screen bg-[#f5f3ed] pt-24 sm:pt-[150px] pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-2 sm:mb-3">
              Curated Experiences
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] font-normal leading-tight">
              {currentActivity.name}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start mb-12">
            <div className="relative w-full h-[300px] sm:h-[380px] md:h-[460px] lg:h-[520px] bg-[#e5e1d8] overflow-hidden">
              {images.length > 0 && (
                <>
                  <img
                    src={currentImageIndex === 0 ? primaryDisplayImage : images[currentImageIndex]}
                    alt={currentActivity.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => openLightbox(currentImageIndex)}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                        aria-label="Previous image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                        aria-label="Next image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl text-[#1a1a1a] font-normal mb-3">
                About this experience
              </h2>
              <p className="text-sm sm:text-base text-[#6B6B6B] font-normal leading-relaxed mb-4">
                {currentActivity.description}
              </p>

              {currentActivity.duration && (
                <p className="text-xs sm:text-sm text-[#6B6B6B] mb-1">
                  <span className="font-medium text-[#1a1a1a] mr-1">Duration:</span>
                  {currentActivity.duration}
                </p>
              )}
              {currentActivity.location && (
                <p className="text-xs sm:text-sm text-[#6B6B6B] mb-1">
                  <span className="font-medium text-[#1a1a1a] mr-1">Location:</span>
                  {currentActivity.location}
                </p>
              )}
              {/* {currentActivity.price && (
                <p className="text-xs sm:text-sm text-[#6B6B6B] mb-4">
                  <span className="font-medium text-[#1a1a1a] mr-1">Price:</span>
                  {currentActivity.price}
                </p>
              )} */}

              <button
                onClick={() => navigate("/booking")}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 sm:px-8 py-2.5 text-xs sm:text-sm tracking-[0.18em] text-white font-medium uppercase hover:bg-[#000000] transition-all duration-300"
              >
                <span>Reserve Now</span>
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="mb-10">
              <h3 className="text-xs sm:text-sm tracking-[0.25em] uppercase text-[#6B6B6B] font-normal mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    className={`w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-[#e5e1d8] overflow-hidden cursor-zoom-in ${
                      currentImageIndex === idx ? "ring-2 ring-[#1a1a1a]" : ""
                    }`}
                  >
                    <img
                      src={src}
                      alt={`${currentActivity.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {otherActivities.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#6B6B6B] font-normal mb-4">
                Other Activities You May Explore
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherActivities.map((activity) => {
                  const thumb =
                    activity.images && activity.images.length > 0
                      ? activity.images[1] || activity.images[0]
                      : "/activity-placeholder.webp";
                  return (
                    <button
                      key={activity._id}
                      type="button"
                      onClick={() => handleSelectActivity(activity._id)}
                      className="text-left bg-[#f5f3ed] hover:bg-[#efe9dd] transition-colors duration-300"
                    >
                      <div className="w-full h-40 sm:h-48 md:h-52 lg:h-56 bg-[#e5e1d8] overflow-hidden">
                        <img
                          src={thumb}
                          alt={activity.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="px-3 py-2">
                        <p className="text-xs sm:text-sm text-[#1a1a1a] font-normal leading-snug line-clamp-2">
                          {activity.name}
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
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
        />
      )}
    </>
  );
};

export default ActivityTemplate;

