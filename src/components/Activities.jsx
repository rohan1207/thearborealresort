import React, { useState } from "react";

const collections = [
  {
    id: 1,
    title: "Golden Hour Lake Sojourn",
    sub: "",
    image: "/activity1.webp",
    span: "col-span-2 row-span-2",
    size: "large",
    tag: "01",
  },
  {
    id: 2,
    title: "Private Candlelight Decor",
    sub: "",
    image: "/activity4.webp",
    span: "col-span-1 row-span-1",
    size: "small",
    tag: "02",
  },
  {
    id: 3,
    title: "Guided Nature Trail",
    sub: "",
    image: "/activity3.jpg",
    span: "col-span-1 row-span-1",
    size: "small",
    tag: "03",
  },
  {
    id: 4,
    title: "Stargazing Experience",
    sub: "",
    image: "/activity2.jpg",
    span: "col-span-2 row-span-1",
    size: "wide",
    tag: "04",
  },
];

export default function Activities() {
  const [hovered, setHovered] = useState(null);

  return (
    <section
      style={{
        background: "#f5f3ed",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "48px 52px 44px",
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
              fontWeight: 500,
              marginBottom: 10,
            }}
          >
            Curated experiences
          </p>
          <h2
            style={{
              fontSize: "clamp(26px, 3vw, 44px)",
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

        <a
          href="#"
          style={{
            fontSize: 11,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
            textDecoration: "none",
            borderBottom: "0.5px solid #1a1a1a",
            paddingBottom: 2,
            cursor: "pointer",
            opacity: 0.6,
            transition: "opacity 0.2s ease",
            position: "absolute",
            right: 52,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.6)}
        >
          View all
        </a>
      </div>

      {/* ── Bento Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 10,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Card 1 — large, 2×2 */}
        <BentoCard
          item={collections[0]}
          hovered={hovered}
          setHovered={setHovered}
          style={{ gridColumn: "span 2", gridRow: "span 2" }}
        />

        {/* Card 2 — small, 1×1 */}
        <BentoCard
          item={collections[1]}
          hovered={hovered}
          setHovered={setHovered}
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
        />

        {/* Card 3 — small, 1×1 */}
        <BentoCard
          item={collections[2]}
          hovered={hovered}
          setHovered={setHovered}
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
        />

        {/* Card 4 — wide, 2×1 */}
        <BentoCard
          item={collections[3]}
          hovered={hovered}
          setHovered={setHovered}
          style={{ gridColumn: "span 2", gridRow: "span 1" }}
        />
      </div>
    </section>
  );
}

function BentoCard({ item, hovered, setHovered, style }) {
  const isHovered = hovered === item.id;
  const isDimmed  = hovered !== null && !isHovered;

  return (
    <div
      onClick={() => (window.location.href = "#")}
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