import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if Lenis is available (smooth scroll library)
    const lenisInstance = window.lenis;
    
    if (lenisInstance) {
      // Use Lenis smooth scroll
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      // Fallback to native scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [pathname]); // Runs every time the route changes

  return null;
};

export default ScrollToTop;
