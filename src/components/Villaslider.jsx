import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  { id: 0, url: "/Forest_Private_Pool_1.jpg", label: "Amenities1" },
  { id: 1, url: "/Forest_Private_Pool_2.jpg", label: "Amenities2" },
  { id: 2, url: "/Forest_Private_Pool_3.jpg", label: "Amenities3" },
  { id: 3, url: "/Forest_Private_Pool_4.jpg", label: "Amenities4" },
];

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Builds a fixed wave-shaped clip for the outgoing image.
// The shape does NOT animate — only translateX moves the image off screen.
// direction=1 (exits left):
//   left edge  → convex outward (bows further left, negative X control points)
//   right edge → concave inward (bows left, control points pull toward center)
// direction=-1 (exits right): mirrored
function buildWaveClip(direction, W, H) {
  const bulge = Math.min(W * 0.07, 70);
  const cpY1 = H * 0.2;
  const cpY2 = H * 0.8;

  if (direction === 1) {
    const lCp = -bulge;       // left edge bows left (convex outward)
    const rCp = W - bulge;    // right edge bows left (concave inward)
    return `path('M 0 0 C ${lCp} ${cpY1}, ${lCp} ${cpY2}, 0 ${H} L ${W} ${H} C ${rCp} ${cpY2}, ${rCp} ${cpY1}, ${W} 0 Z')`;
  } else {
    const lCp = bulge;        // left edge bows right (concave inward)
    const rCp = W + bulge;    // right edge bows right (convex outward)
    return `path('M 0 0 C ${lCp} ${cpY1}, ${lCp} ${cpY2}, 0 ${H} L ${W} ${H} C ${rCp} ${cpY2}, ${rCp} ${cpY1}, ${W} 0 Z')`;
  }
}

const DURATION = 800;
const AUTO_INTERVAL = 3000;
const DRIFT_PX = 28;

export default function VillaSlider() {
  const [current, setCurrent] = useState(0);
  const [nextSlide, setNextSlide] = useState(null);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [hoverSide, setHoverSide] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );
  const [size, setSize] = useState({ w: 1100, h: 420 });
  const [driftProgress, setDriftProgress] = useState(0);

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const autoRef = useRef(null);
  const containerRef = useRef(null);
  const driftRafRef = useRef(null);
  const driftStartRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    );
    ro.observe(el);
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const startDrift = useCallback(() => {
    setDriftProgress(0);
    driftStartRef.current = null;
    const animate = (ts) => {
      if (!driftStartRef.current) driftStartRef.current = ts;
      const p = Math.min((ts - driftStartRef.current) / AUTO_INTERVAL, 1);
      setDriftProgress(p);
      if (p < 1) driftRafRef.current = requestAnimationFrame(animate);
    };
    driftRafRef.current = requestAnimationFrame(animate);
  }, []);

  const stopDrift = useCallback(() => {
    cancelAnimationFrame(driftRafRef.current);
    setDriftProgress(0);
  }, []);

  const startTransition = useCallback((target, dir) => {
    if (transitioning) return;
    clearTimeout(autoRef.current);
    stopDrift();
    setNextSlide(target);
    setDirection(dir);
    setProgress(0);
    setTransitioning(true);
    startRef.current = null;
  }, [transitioning, stopDrift]);

  const goNext = useCallback(() => {
    startTransition((current + 1) % SLIDES.length, 1);
  }, [current, startTransition]);

  const goPrev = useCallback(() => {
    startTransition((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, startTransition]);

  useEffect(() => {
    if (!transitioning) return;
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / DURATION, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(nextSlide);
        setNextSlide(null);
        setProgress(0);
        setTransitioning(false);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [transitioning, nextSlide]);

  useEffect(() => {
    if (transitioning) return;
    startDrift();
    autoRef.current = setTimeout(goNext, AUTO_INTERVAL);
    return () => {
      clearTimeout(autoRef.current);
      cancelAnimationFrame(driftRafRef.current);
    };
  }, [transitioning, current, goNext, startDrift]);

  const activeDot = transitioning ? nextSlide : current;
  const prevIdx = (current - 1 + SLIDES.length) % SLIDES.length;
  const nextIdx = (current + 1) % SLIDES.length;
  const driftOffset = -driftProgress * DRIFT_PX;
  const driftScale = 1.03;

  // Eased progress for the translate
  const ep = ease(progress);
  // Outgoing image slides fully off screen in its direction
  const slideOutX = !isMobile && transitioning
    ? direction === 1
      ? -(size.w * 1.08) * ep
      : (size.w * 1.08) * ep
    : 0;
  const slideOutY = isMobile && transitioning
    ? direction === 1
      ? -(size.h * 1.08) * ep
      : (size.h * 1.08) * ep
    : 0;

  // Fixed wave clip — computed once per direction+size, not per frame
  const waveClip = buildWaveClip(direction, size.w, size.h);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Cormorant:wght@300;400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .v-root{
          background:#f4f1eb;min-height:100vh;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;padding:40px 20px;
        }
        .v-title{
          font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-weight:400;
          font-size:clamp(30px,4.2vw,52px);letter-spacing:0.22em;
          color:#2c2820;line-height:1;margin-bottom:10px;
        }
        .v-ornament{display:flex;gap:7px;margin-bottom:30px;}
        .v-ornament span{width:4px;height:4px;border-radius:50%;background:#b5a98a;opacity:0.65;}
        .v-wrap{position:relative;width:min(68vw,920px);isolation:isolate;}
        .v-peek{
          position:absolute;top:0;height:100%;width:170px;overflow:hidden;z-index:0;
        }
        .v-peek-left{right:calc(100% - 95px);border-radius:3px 0 0 3px;}
        .v-peek-right{left:calc(100% - 95px);border-radius:0 3px 3px 0;}
        .v-peek img{
          position:absolute;top:0;height:100%;
          width:calc(min(68vw,920px) + 170px);max-width:none;
          object-fit:cover;pointer-events:none;user-select:none;
        }
        .v-peek-left img{right:0;object-position:right center;}
        .v-peek-right img{left:0;object-position:left center;}
        .v-stage{
          position:relative;width:100%;aspect-ratio:16/8.8;overflow:visible;z-index:30;
        }
        .v-img{
          position:absolute;inset:0;width:100%;height:100%;
          object-fit:cover;object-position:center;display:block;
          pointer-events:none;user-select:none;
        }
        .v-zone{
          position:absolute;top:0;height:100%;width:50%;
          z-index:20;display:flex;align-items:center;
        }
        .v-zone-l{left:0;justify-content:flex-start;padding-left:22px;}
        .v-zone-r{right:0;justify-content:flex-end;padding-right:22px;}
        .v-arrowbtn{
          width:46px;height:46px;border-radius:50%;
          background:rgba(255,255,255,0.14);border:1px solid rgba(255,255,255,0.28);
          display:flex;align-items:center;justify-content:center;cursor:pointer;
          backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
          opacity:0;transition:opacity 0.22s,background 0.18s,transform 0.18s;
        }
        .v-zone:hover .v-arrowbtn{opacity:1;}
        .v-arrowbtn:hover{background:rgba(255,255,255,0.26);transform:scale(1.1);}
        .v-dots{position:absolute;bottom:16px;right:20px;display:flex;gap:8px;z-index:30;}
        .v-dot{
          height:6px;border-radius:3px;border:none;padding:0;
          background:rgba(255,255,255,0.38);cursor:pointer;
          transition:width 0.42s cubic-bezier(.4,0,.2,1),background 0.3s;
        }
        .v-dot.on{background:rgba(255,255,255,0.95);}
        .v-room-name{
          margin-top:16px;
          font-family:system-ui,-apple-system,'Segoe UI',sans-serif;
          font-weight:500;
          font-size:clamp(18px,2vw,24px);
          letter-spacing:0.03em;
          color:#1a1a1a;
          text-transform:none;
        }
        .v-caption{
          margin-top:18px;font-family:'Cormorant Garamond',Georgia,serif;
          font-style:normal;font-weight:400;font-size:clamp(13px,1.2vw,15px);
          letter-spacing:0.08em;color:#6B6B6B;
        }
        @media (max-width: 640px){
          .v-root{
            min-height:auto;
            padding:32px 14px 36px;
          }
          .v-wrap{
            width:min(88vw,360px);
          }
          .v-peek{
            display:none;
          }
          .v-stage{
            aspect-ratio:3/4;
            overflow:hidden;
          }
          .v-zone{
            width:100%;
            height:50%;
          }
          .v-zone-l{
            top:0;
            left:0;
            justify-content:center;
            align-items:flex-start;
            padding-left:0;
            padding-top:14px;
          }
          .v-zone-r{
            bottom:0;
            right:0;
            justify-content:center;
            align-items:flex-end;
            padding-right:0;
            padding-bottom:14px;
          }
        }
      `}</style>

      <div className="v-root">
        <h2 className="text-3xl font-light text-stone-900 leading-tight">Accommodations</h2>
        <div className="v-ornament">{[0,1,2,3].map(i=><span key={i}/>)}</div>

        <div className="v-wrap">
          <div className="v-peek v-peek-left">
            <img src={SLIDES[prevIdx].url} alt="" draggable={false} />
          </div>
          <div className="v-peek v-peek-right">
            <img src={SLIDES[nextIdx].url} alt="" draggable={false} />
          </div>

          <div
            className="v-stage"
            ref={containerRef}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              if (isMobile) {
                setHoverSide(e.clientY - r.top < r.height / 2 ? "left" : "right");
              } else {
                setHoverSide(e.clientX - r.left < r.width / 2 ? "left" : "right");
              }
            }}
            onMouseLeave={() => setHoverSide(null)}
            style={{
              cursor: hoverSide === "left"
                ? isMobile
                  ? "n-resize"
                  : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M22 8L12 18L22 28' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E\") 18 18, w-resize"
                : hoverSide === "right"
                ? isMobile
                  ? "s-resize"
                  : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36'%3E%3Cpath d='M14 8L24 18L14 28' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E\") 18 18, e-resize"
                : "default"
            }}
          >
            {/* Incoming slide — flat beneath, fully revealed as outgoing slides away */}
            {transitioning && nextSlide !== null && (
              <img
                className="v-img"
                src={SLIDES[nextSlide].url}
                alt=""
                draggable={false}
                style={{ zIndex: 1 }}
              />
            )}

            {/* Outgoing slide:
                IDLE   → gentle drift (scale + translateX)
                TRANSITION → fixed wave clip applied immediately,
                             then the shaped image translates off screen */}
            <img
              className="v-img"
              src={SLIDES[current].url}
              alt=""
              draggable={false}
              style={{
                zIndex: 2,
                ...(transitioning
                  ? {
                      ...(isMobile
                        ? {}
                        : {
                            clipPath: waveClip,
                            WebkitClipPath: waveClip,
                          }),
                      transform: isMobile
                        ? `translateY(${slideOutY}px)`
                        : `translateX(${slideOutX}px)`,
                      willChange: "transform",
                    }
                  : {
                      transform: `scale(${driftScale}) translateX(${driftOffset}px)`,
                      willChange: "transform",
                    }),
              }}
            />

            <div className="v-zone v-zone-l" onClick={goPrev}>
              <button className="v-arrowbtn" tabIndex={-1} aria-label="Previous">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M9.5 2.5L4.5 7.5L9.5 12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="v-zone v-zone-r" onClick={goNext}>
              <button className="v-arrowbtn" tabIndex={-1} aria-label="Next">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M5.5 2.5L10.5 7.5L5.5 12.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="v-dots">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`v-dot${i === activeDot ? " on" : ""}`}
                  style={{ width: i === activeDot ? 22 : 6 }}
                  onClick={() => {
                    if (i === current || transitioning) return;
                    startTransition(i, i > current ? 1 : -1);
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="v-room-name">The Forest Private Pool</p>
        <p className="v-caption">
          {SLIDES[transitioning && nextSlide !== null ? nextSlide : current].label}
        </p>
      </div>
    </>
  );
}