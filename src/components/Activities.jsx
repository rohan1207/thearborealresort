import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function Activities() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/activities");
        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Failed to load activities for homepage:", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const enabledActivities = activities.filter((activity) => {
    if (activity?.enabled === false) return false;
    if (activity?.isEnabled === false) return false;
    if (activity?.isActive === false) return false;
    if (activity?.status === "disabled" || activity?.status === "inactive") return false;
    return true;
  });

  // Always fill all 4 layout slots. If backend returns fewer active activities,
  // repeat available ones so the bento grid never leaves blank spaces.
  const slotActivities = Array.from({ length: 4 }, (_, index) => {
    if (enabledActivities.length === 0) return null;
    return enabledActivities[index % enabledActivities.length];
  }).filter(Boolean);

  const mappedActivities = slotActivities.map((activity, index) => {
    const images = activity.images || [];
    const image = images[1] || "/activity-placeholder.webp";

    const size =
      index === 0 ? "large" : index === 3 ? "wide" : "small";

    return {
      id: activity._id,
      title: activity.name,
      image,
      size,
      tag: String(index + 1).padStart(2, "0"),
    };
  });

  if (!loading && mappedActivities.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        background: "#f5f3ed",
        width: "100%",
        height: isMobile ? "auto" : "100vh",
        display: "flex",
        flexDirection: "column",
        padding: isMobile ? "32px 16px 28px" : "48px 52px 44px",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 32,
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#6B6B6B",
              fontFamily: "system-ui, sans-serif",
              fontWeight: 400,
              marginBottom: 10,
            }}
          >
            Curated experiences
          </p>
          <h2
            style={{
              fontSize: "clamp(22px, 2.4vw, 32px)",
              fontWeight: 400,
              color: "#1a1a1a",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Activities You Can Experience
          </h2>
        </div>

      </div>

      {/* ── Bento Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gridTemplateRows: isMobile ? "auto" : "repeat(2, 1fr)",
          gap: 10,
          flex: 1,
          minHeight: 0,
        }}
      >
        {mappedActivities.map((item, idx) => (
          <BentoCard
            key={`${item.id}-${idx}`}
            item={item}
            hovered={hovered}
            setHovered={setHovered}
            onClick={() =>
              navigate(`/activities/${item.id}`, { state: { activityId: item.id } })
            }
            style={{
              gridColumn:
                item.size === "large"
                  ? "span 2"
                  : item.size === "wide"
                  ? "span 2"
                  : "span 1",
              gridRow:
                item.size === "large"
                  ? isMobile
                    ? "span 1"
                    : "span 2"
                  : "span 1",
              minHeight:
                item.size === "large"
                  ? isMobile
                    ? 300
                    : undefined
                  : item.size === "wide"
                  ? isMobile
                    ? 220
                    : undefined
                  : isMobile
                  ? 190
                  : undefined,
            }}
          />
        ))}
      </div>
    </section>
  );
}

function BentoCard({ item, hovered, setHovered, style, onClick }) {
  const isHovered = hovered === item.id;
  const isDimmed  = hovered !== null && !isHovered;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(item.id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        ...style,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: "#e9e5dd",
        transition: "opacity 0.4s ease",
        opacity: isDimmed ? 0.45 : 1,
      }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.68) 100%)"
            : "linear-gradient(to bottom, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 100%)",
          transition: "background 0.5s ease",
        }}
      />

      {/* Tag number */}
      <span
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          fontSize: 10,
          letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.7)",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        {item.tag}
      </span>

      {/* Arrow on hover */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 18,
          width: 28,
          height: 28,
          border: "0.5px solid rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "scale(1)" : "scale(0.7)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path d="M1 10L10 1M10 1H3M10 1V8" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 20px 20px",
          transform: isHovered ? "translateY(0)" : "translateY(4px)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          style={{
            fontSize: item.size === "large" ? 24 : 16,
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.01em",
            lineHeight: 1.2,
            margin: "0",
          }}
        >
          {item.title}
        </p>
      </div>
    </div>
  );
}