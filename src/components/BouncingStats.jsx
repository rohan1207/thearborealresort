import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

// Ball data
const stats = [
  { value: "30+", label: "Rooms", color: "from-blue-400 to-blue-600" },
  {
    value: "50+",
    label: "Happy Clients",
    color: "from-emerald-400 to-emerald-600",
  },
  { value: "20+", label: "Years", color: "from-orange-400 to-orange-600" },
];

const CONFIG = {
  BALL_RADIUS: 50,
  GRAVITY: 1200,
  BOUNCE_DAMPING: 0.75,
  FRICTION: 0.995,
  MOUSE_REPULSION_FORCE: 1000,
  MOUSE_REPULSION_RADIUS: 140,
  COLLISION_DAMPING: 0.85,
  MIN_VELOCITY: 8,
  RANDOM_IMPULSE: 200,
  SETTLE_DAMPING: 0.92,
};

const BouncingStats = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [containerBounds, setContainerBounds] = useState({
    width: 800,
    height: 500,
  });
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [balls, setBalls] = useState([]);

  // Initialize balls with random positions
  const initializeBalls = useCallback(() => {
    const { width, height } = containerBounds;

    return stats.map((stat, i) => ({
      id: i,
      x: CONFIG.BALL_RADIUS + Math.random() * (width - CONFIG.BALL_RADIUS * 2),
      y: height - CONFIG.BALL_RADIUS - Math.random() * 50, // Start at bottom with slight randomness
      vx: (Math.random() - 0.5) * CONFIG.RANDOM_IMPULSE,
      vy: -Math.random() * CONFIG.RANDOM_IMPULSE, // Initial upward velocity
      radius: CONFIG.BALL_RADIUS,
      ...stat,
    }));
  }, [containerBounds]);

  // Update container bounds to cover the entire component
  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({ width: rect.width, height: rect.height });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Initialize balls when bounds change
  useEffect(() => {
    if (containerBounds.width > 0) {
      setBalls(initializeBalls());
    }
  }, [containerBounds, initializeBalls]);

  // Mouse tracking across entire component
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouse({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Physics simulation
  useEffect(() => {
    if (balls.length === 0) return;

    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016);
      lastTime = currentTime;

      setBalls((prevBalls) => {
        const newBalls = prevBalls.map((ball) => ({ ...ball }));
        const { width, height } = containerBounds;

        newBalls.forEach((ball) => {
          // Apply gravity
          ball.vy += CONFIG.GRAVITY * deltaTime;

          // Mouse repulsion (only when hovering) - FREE DIRECTIONAL REPULSION
          if (isHovered) {
            const dx = ball.x - mouse.x;
            const dy = ball.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.MOUSE_REPULSION_RADIUS && distance > 0) {
              // Calculate base repulsion force (stronger when closer)
              const repulsionForce =
                CONFIG.MOUSE_REPULSION_FORCE *
                (1 - distance / CONFIG.MOUSE_REPULSION_RADIUS);

              // Natural direction away from mouse
              const baseAngle = Math.atan2(dy, dx);

              // Add random deviation for chaotic movement (±45 degrees)
              const randomDeviation = (Math.random() - 0.5) * Math.PI * 0.5;
              const finalAngle = baseAngle + randomDeviation;

              // Apply force in the calculated direction
              const forceX = Math.cos(finalAngle) * repulsionForce * deltaTime;
              const forceY = Math.sin(finalAngle) * repulsionForce * deltaTime;

              ball.vx += forceX;
              ball.vy += forceY;

              // Add extra random impulse for more chaotic behavior
              ball.vx += (Math.random() - 0.5) * 100 * deltaTime;
              ball.vy += (Math.random() - 0.5) * 100 * deltaTime;

              // Ensure minimum repulsion velocity for dynamic movement
              const currentSpeed = Math.sqrt(
                ball.vx * ball.vx + ball.vy * ball.vy
              );
              if (currentSpeed < 200) {
                const speedMultiplier = 200 / currentSpeed;
                ball.vx *= speedMultiplier;
                ball.vy *= speedMultiplier;
              }
            }
          }

          // Apply velocity
          ball.x += ball.vx * deltaTime;
          ball.y += ball.vy * deltaTime;

          // Wall collisions with proper bouncing
          if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx) * CONFIG.BOUNCE_DAMPING;
          }
          if (ball.x + ball.radius >= width) {
            ball.x = width - ball.radius;
            ball.vx = -Math.abs(ball.vx) * CONFIG.BOUNCE_DAMPING;
          }
          if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy) * CONFIG.BOUNCE_DAMPING;
          }
          if (ball.y + ball.radius >= height) {
            ball.y = height - ball.radius;
            ball.vy = -Math.abs(ball.vy) * CONFIG.BOUNCE_DAMPING;

            // Add slight random horizontal movement when hitting ground
            if (Math.random() < 0.1) {
              ball.vx += (Math.random() - 0.5) * 50;
            }
          }

          // Apply friction differently based on hover state
          const currentFriction = isHovered
            ? CONFIG.FRICTION
            : CONFIG.SETTLE_DAMPING;
          ball.vx *= currentFriction;
          ball.vy *= currentFriction;

          // Stop micro movements
          if (Math.abs(ball.vx) < CONFIG.MIN_VELOCITY) ball.vx = 0;
          if (
            Math.abs(ball.vy) < CONFIG.MIN_VELOCITY &&
            ball.y + ball.radius >= height - 5
          )
            ball.vy = 0;
        });

        // Ball-to-ball collisions with realistic physics
        for (let i = 0; i < newBalls.length; i++) {
          for (let j = i + 1; j < newBalls.length; j++) {
            const ballA = newBalls[i];
            const ballB = newBalls[j];

            const dx = ballB.x - ballA.x;
            const dy = ballB.y - ballA.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistance = ballA.radius + ballB.radius;

            if (distance < minDistance) {
              // Separate balls to prevent overlap
              const overlap = minDistance - distance;
              const separationX = (dx / distance) * overlap * 0.5;
              const separationY = (dy / distance) * overlap * 0.5;

              ballA.x -= separationX;
              ballA.y -= separationY;
              ballB.x += separationX;
              ballB.y += separationY;

              // Calculate realistic collision response
              const angle = Math.atan2(dy, dx);
              const sin = Math.sin(angle);
              const cos = Math.cos(angle);

              // Rotate velocity vectors
              const vx1 = ballA.vx * cos + ballA.vy * sin;
              const vy1 = ballA.vy * cos - ballA.vx * sin;
              const vx2 = ballB.vx * cos + ballB.vy * sin;
              const vy2 = ballB.vy * cos - ballB.vx * sin;

              // Exchange velocities (elastic collision)
              const newVx1 = vx2 * CONFIG.COLLISION_DAMPING;
              const newVx2 = vx1 * CONFIG.COLLISION_DAMPING;

              // Rotate back to original coordinate system
              ballA.vx = newVx1 * cos - vy1 * sin;
              ballA.vy = vy1 * cos + newVx1 * sin;
              ballB.vx = newVx2 * cos - vy2 * sin;
              ballB.vy = vy2 * cos + newVx2 * sin;

              // Add small random impulse for more natural movement
              if (isHovered) {
                ballA.vx += (Math.random() - 0.5) * 30;
                ballA.vy += (Math.random() - 0.5) * 30;
                ballB.vx += (Math.random() - 0.5) * 30;
                ballB.vy += (Math.random() - 0.5) * 30;
              }
            }
          }
        }

        // Random impulses when hovering for more dynamic movement
        if (isHovered && Math.random() < 0.008) {
          const randomBall =
            newBalls[Math.floor(Math.random() * newBalls.length)];
          randomBall.vx += (Math.random() - 0.5) * CONFIG.RANDOM_IMPULSE;
          randomBall.vy += (Math.random() - 0.5) * CONFIG.RANDOM_IMPULSE;
        }

        return newBalls;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [balls.length, containerBounds, mouse, isHovered]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[600px] bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-emerald-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-8 lg:p-16 h-full">
        {/* Left Content */}
        <div className="flex-1 max-w-lg mb-8 lg:mb-0">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-6xl font-light mb-4 text-gray-800 leading-tight"
          >
            Luxury{" "}
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-semibold">
              Accommodation
            </span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl lg:text-2xl font-light mb-6 text-gray-600"
          >
            with impeccable service
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-500 leading-relaxed mb-8"
          >
            Experience the perfect blend of luxury and comfort. Our premium
            accommodations offer unparalleled service and attention to detail
            that will make your stay unforgettable.
          </motion.p>

          {/* Interaction Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-sm text-gray-400 flex items-center space-x-2"
          >
            <span className="animate-pulse">✨</span>
            <span>Move your mouse to interact with the floating stats</span>
          </motion.div>
        </div>

        {/* Right Content - Main Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white/80"
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-100 via-white to-orange-100 flex items-center justify-center text-8xl">
              🏨
            </div>
          </motion.div>
        </div>
      </div>

      {/* Physics Balls - Cover Entire Component */}
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          className={`absolute flex flex-col items-center justify-center text-white font-bold rounded-full shadow-xl cursor-pointer select-none backdrop-blur-sm border border-white/20 bg-gradient-to-br ${ball.color} shadow-2xl`}
          style={{
            left: ball.x - ball.radius,
            top: ball.y - ball.radius,
            width: ball.radius * 2,
            height: ball.radius * 2,
            zIndex: 20,
          }}
          animate={{
            scale: isHovered ? [1, 1.05, 1] : 1,
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
            },
          }}
        >
          <span className="text-lg font-bold mb-1 drop-shadow-md">
            {ball.value}
          </span>
          <span className="text-xs opacity-90 text-center px-1 drop-shadow-sm font-medium">
            {ball.label}
          </span>
        </motion.div>
      ))}

      {/* Mouse Repulsion Indicator (visible when hovering) */}
      {isHovered && (
        <motion.div
          className="absolute w-6 h-6 border-2 border-white/60 rounded-full pointer-events-none z-30"
          style={{
            left: mouse.x - 12,
            top: mouse.y - 12,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        >
          <div className="absolute inset-2 bg-white/40 rounded-full"></div>
        </motion.div>
      )}
    </div>
  );
};

export default BouncingStats;
